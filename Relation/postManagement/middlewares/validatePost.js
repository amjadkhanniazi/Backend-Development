import joi from "joi";


const validatePost = (post) => {
    const schema = joi.object({
        title: joi.string().min(1).max(100).required(),
        content: joi.string().min(1).required(),
    }).unknown();
    
    return schema.validate(post);
}

export default validatePost;