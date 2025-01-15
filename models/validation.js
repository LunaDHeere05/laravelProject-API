const db = require("../db");
const bcrypt = require("bcrypt");

const validation = {
    isRequired: (value) => {
        return value !== undefined && value !== null && value !== '';
    },

    minLength: (value, min) => {
        return typeof value === 'string' && value.length >= min;
    },

    isNumber: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    sanitizeString: (value) => {
        return typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, '') : value;
    },
    isEmailTaken: async (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) {
                    console.error("Error checking email:", err);
                    return reject(err); // Reject promise if there's an error
                }
                resolve(results[0].count > 0); // Resolve true if email exists, false otherwise
            });
        });
    },
    checkUserExists: async (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE id = ?';
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error("Error checking user existence:", err);
                    return reject(err); // Reject promise if there's an error
                }
                resolve(results[0].count > 0); // Resolve true if user exists, false otherwise
            });
        });
    },

    validateUser: async (data, isNew) => {
        const errors = [];

        if(isNew){
            if (!validation.isRequired(data.name)) {
                errors.push("Name is required.");
            } else if (!validation.minLength(data.name, 3)) {
                errors.push("Name must be at least 3 characters long.");
            } else if(data.name?.trim().match(/\d+/g) != null){
                errors.push("name cannot contain numbers.");
            }else{
                const name = validation.sanitizeString(data.name);
            }
        }else{
            if(data.name){
                if (!validation.minLength(data.name, 3)) {
                    errors.push("Name must be at least 3 characters long.");
                } else if(data.name?.trim().match(/\d+/g) != null){
                    errors.push("name cannot contain numbers.");
                }else{
                    const name = validation.sanitizeString(data.name);
                }
            }
        }

        //email

        if(isNew){
            if(!validation.isRequired(data.email)){
                errors.push("Email is required.");
            }else if(await validation.isEmailTaken(data.email)){
                errors.push("Email is already taken.");
            }else{
                //email moet juiste formaat hebben
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailPattern.test(data.email?.trim())){
                    errors.push("Email is not valid.");
                }
                else{
                    const email = validation.sanitizeString(data.email);
                }
            }
        }else if(data.email){
            if(await validation.isEmailTaken(data.email)){
                errors.push("Email is already taken.");
            }else{
                //email moet juiste formaat hebben
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailPattern.test(data.email?.trim())){
                    errors.push("Email is not valid.");
                }
                else{
                    const email = validation.sanitizeString(data.email);
                }
            }
        }

        //password
        if(isNew){
            if(!data.password){
                errors.push("Password cannot be empty.");
            }else{
                if (!validation.minLength(data.password?.trim(), 6)) {
                    errors.push("Password must be at least 6 characters long");
                }else{
                    const password = bcrypt.hashSync(data.password, 10);
                }
            }
        }else if(data.password){
            if (!validation.minLength(data.password?.trim(), 6)) {
                errors.push("Password must be at least 6 characters long");
            }else{
                const password = bcrypt.hashSync(data.password, 10);
            }
        }

        //end required fields
        //date of birth

        if(data.date_birth){
            const dateOfBirth = validation.sanitizeString(data.date_birth);
        }

        //profile picture

        if(data.profile_picture){
            const allowedFormats = ['jpg', 'jpeg', 'png'];
            const extension = data.profile_picture.split('.').pop().toLowerCase();
            if(!allowedFormats.includes(extension)){
                errors.push("Profile picture must be a jpg, jpeg or png file.");
            }
        }else if(!data.profile_picture){
            data.profile_picture = 'default.jpg';
        }else{
            const profile_picture = validation.sanitizeString(data.profile_picture);
        }

        //about me

        if(data.abt_me){
            const aboutMe = validation.sanitizeString(data.abt_me);
        }
        
        //isadmin

        if(data.isadmin){
            if(data.isadmin ===1 || data.isadmin === 0){
                const isAdmin = data.isadmin;
            }else{
                errors.push("Isadmin must be 1 or 0.");
            }
        }

        return errors.length > 0 ? errors : null;


    },


    validatePost: async (data, isNew) => {
        const errors = [];
    
        if(isNew){
            if (!validation.isRequired(data.user_id) || !validation.isNumber(data.user_id)) {
                errors.push("A valid user ID is required.");
            } else if (!await validation.checkUserExists(data.user_id)) {
                    errors.push("User ID does not exist.");
            }
        }else{
            if(data.user_id){
                if (!validation.isNumber(data.user_id)) {
                    errors.push("You tried to update this post. A valid user ID is required.");
                } else if (!await validation.checkUserExists(data.user_id)) {
                    errors.push("You tried to update this post. User ID does not exist.");
                }
            }
        }
        if(isNew){
            if (!validation.isRequired(data.titel)) {
                console.log(data);
                errors.push("titel is required.");
            } else if (!validation.minLength(data.titel, 3)) {
                errors.push("titel must be at least 3 characters long.");
            }
        }else{
            if(data.titel){
                if (!validation.minLength(data.titel, 3)) {
                    errors.push("titel must be at least 3 characters long.");
                }
            }
        }
    
        // Content: optional for updates, required for new posts
        if (isNew) {
            if (!validation.isRequired(data.content)) {
                errors.push("Content is required.");
            } else if (data.content && data.content.length < 10) {
                errors.push("Content must be at least 10 characters long.");
            }
        } else {
            // Content is optional for updates
            if (data.content && data.content.length < 10) {
                errors.push("Content must be at least 10 characters long.");
            }
        }
    
        return errors.length > 0 ? errors : null;
    }
    
};

module.exports = validation;
