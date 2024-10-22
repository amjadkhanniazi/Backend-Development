# Updated Code:
# Fix for the newline issue: used a better parsing technique to ignore the "Contact" keyword in the name extraction.
# Processing latest 10 emails: limit the emails processed to the 10 most recent.


import imaplib
import email
import re
import pandas as pd
import config

# Function to connect to the email server
def connect_to_email(username, password):
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login(username, password)
    return mail

# Function to fetch and parse the latest 10 emails
def fetch_emails(mail, folder='inbox', limit=10):
    mail.select(folder)
    result, data = mail.search(None, 'ALL')
    email_ids = data[0].split()

    # Fetch the latest 'limit' emails
    latest_email_ids = email_ids[-limit:]
    emails = []

    for e_id in latest_email_ids:
        result, msg_data = mail.fetch(e_id, '(RFC822)')
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        # Check if email is multipart
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        body = part.get_payload(decode=True).decode('utf-8')
                    except UnicodeDecodeError:
                        try:
                            body = part.get_payload(decode=True).decode('latin-1')
                        except UnicodeDecodeError:
                            body = part.get_payload(decode=True).decode('windows-1252')
                    emails.append(body)
        else:
            try:
                body = msg.get_payload(decode=True).decode('utf-8')
            except UnicodeDecodeError:
                try:
                    body = msg.get_payload(decode=True).decode('latin-1')
                except UnicodeDecodeError:
                    body = msg.get_payload(decode=True).decode('windows-1252')
            emails.append(body)

    return emails

# Function to extract name and phone number
import re

def extract_name_and_phone(email_body):
    # Adjusted regex patterns for both formats
    
    # Match the name for the standard format "Name/Surname"
    name_pattern = r"Name/Surname\s*([A-Za-z\s]+)(?=\n|$)"
    
    # Match the phone number pattern
    phone_pattern = r"Phone\s*(\d{11})"
    
    # Additional pattern to capture the "Shipping Details" format
    shipping_pattern = r"Shipping Details:\s*\n+([A-Za-z\s]+)\n+.*?\n+.*?\n+Phone:\s*(\d{10,11})"
    
    # First, try matching the "Shipping Details" format
    shipping_match = re.search(shipping_pattern, email_body)
    
    if shipping_match:
        name = shipping_match.group(1).strip()
        phone = shipping_match.group(2).strip()
    else:
        # If "Shipping Details" format is not found, use the standard format
        name_match = re.search(name_pattern, email_body)
        phone_match = re.search(phone_pattern, email_body)
        
        name = name_match.group(1).strip() if name_match else "N/A"
        phone = phone_match.group(1).strip() if phone_match else "N/A"
    
    return name, phone


# Function to save data to Excel
def save_to_excel(data, filename='V2_output.xlsx'):
    df = pd.DataFrame(data, columns=['Name', 'Phone Number'])
    df.to_excel(filename, index=False)
    print(f"Data saved to {filename}")

# Main function
def main(username, password):
    mail = connect_to_email(username, password)
    
    print("Fetching latest 10 emails...")
    emails = fetch_emails(mail, limit=20)

    data = []
    
    for email_body in emails:
        name, phone = extract_name_and_phone(email_body)
        data.append([name, phone])
    
    save_to_excel(data)

# Replace with your email credentials
username = config.EMAIL_USERNAME
password = config.EMAIL_PASSWORD

# Run the script
if __name__ == "__main__":
    main(username, password)
