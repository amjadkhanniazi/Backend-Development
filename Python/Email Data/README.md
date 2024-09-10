# Project README

## Overview

This repository contains scripts for extracting data from emails and saving it to Excel files. To maintain security and cleanliness in the repository, we need to ensure that sensitive files, such as configuration files with credentials and generated Excel files, are properly managed and excluded from version control.

## Managing Sensitive Data and Generated Files

### 1. **Handling Configuration Files with Credentials**

To keep sensitive information such as email credentials out of version control:

1. **Create a Configuration File**

   Create a file named `config.py` (or similar) in the root directory to store credentials.

   **Example `config.py`:**
   ```python
   # config.py
   EMAIL_USERNAME = 'your-email@gmail.com'
   EMAIL_PASSWORD = 'your-password'
   ```

2. **Update Your Script**

   Modify your script to import and use credentials from `config.py`.

   **Example Script Update:**
   ```python
   import config  # Import the config file

   # Load credentials from config file
   if __name__ == "__main__":
       main(config.EMAIL_USERNAME, config.EMAIL_PASSWORD, 'Hello', datetime(2024, 9, 1), datetime(2024, 9, 30), 10)
   ```

3. **Update `.gitignore`**

   Add `config.py` to your `.gitignore` file to ensure it is not tracked by Git.

   **Example `.gitignore`:**
   ```gitignore
   # Ignore configuration file with credentials
   config.py

   # Ignore Excel files
   *.xlsx
   ```

### 2. **Removing Committed Excel Files**

If Excel files have been committed to the repository and you want to remove them:

1. **Remove Files from Index**

   Use the following command to remove `.xlsx` files from the Git index but keep them locally:

   ```bash
   git rm --cached '*.xlsx'
   ```

2. **Commit the Removal**

   Commit the changes to remove the files from the repository:

   ```bash
   git commit -m "Remove all committed Excel files from repository"
   ```

3. **Push the Changes**

   Push the commit to the remote repository:

   ```bash
   git push
   ```

### 3. **Removing Files from Repository History (Optional)**

To completely remove `.xlsx` files from the repository history:

#### Using `git filter-repo`:

1. **Install `git-filter-repo`**

   ```bash
   pip install git-filter-repo
   ```

2. **Remove `.xlsx` Files from History**

   ```bash
   git filter-repo --path '*.xlsx' --invert-paths
   ```

3. **Push the Changes**

   Force push the changes to the remote repository:

   ```bash
   git push --force
   ```

#### Using `git filter-branch`:

1. **Remove Files from History**

   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch *.xlsx' \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **Clean Up Refs and Garbage**

   ```bash
   rm -rf .git/refs/original/
   git reflog expire --expire=now --all-ref
   git gc --prune=now --aggressive
   ```

3. **Push the Changes**

   Force push the changes:

   ```bash
   git push --force --all
   git push --force --tags
   ```

## Summary

- **Sensitive Data**: Store credentials in a separate configuration file (`config.py`) and ensure it's excluded using `.gitignore`.
- **Generated Files**: Remove generated Excel files from the repository with `git rm --cached` and update `.gitignore`.
- **History Cleanup**: Use `git filter-repo` or `git filter-branch` for complete removal of files from Git history.
