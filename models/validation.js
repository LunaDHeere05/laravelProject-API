const db = require("../db");
const bcrypt = require("bcrypt");

const validation = {
    // Check if a value exists and is not empty
    isRequired: (value) => {
        return value !== undefined && value !== null && value !== '';
    },

    // Check if a string has a minimum length
    minLength: (value, min) => {
        return typeof value === 'string' && value.length >= min;
    },

    // Validate if a value is a number
    isNumber: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Sanitize a string to prevent HTML injection
    sanitizeString: (value) => {
        return typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, '') : value;
    },

    // Validate user data
    validateUser: (data) => {
        const errors = [];

        if (!userData.username) {
            errors.push("Username cannot be empty.");
        }else{
            if (!validation.minLength(data.username.trim(), 3)) {
                errors.push("Username must be at least 3 characters long");
            }
            else if(data.username.trim().match(/\d+/g) != null){
                errors.push("Username cannot contain numbers.");
            }else{
                const username = validation.sanitizeString(data.username);
            }
        }

        //email

        if (!userData.email) {
            errors.push("Email cannot be empty.");
        }else if(userData.email = await isEmailTaken(data.email)){
            errors.push("Email is already taken.");
        }else{
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailPattern.test(data.email.trim())){
                errors.push("Email is not valid.");
            }
            else{
                const email = validation.sanitizeString(data.email);
            }
        }

        //password

        if(!userData.password){
            errors.push("Password cannot be empty.");
        }else{
            if (!validation.minLength(data.password.trim(), 6)) {
                errors.push("Password must be at least 6 characters long");
            }else{
                const password = bcrypt.hashSync(data.password, 10);
            }
        }

        //end required fields
        //date of birth


        //profile picture

        if(userData.profile_picture){
            const allowedFormats = ['jpg', 'jpeg', 'png'];
            const extension = userData.profile_picture.split('.').pop().toLowerCase();
            if(!allowedFormats.includes(extension)){
                errors.push("Profile picture must be a jpg, jpeg or png file.");
            }
        }else if(!userData.profile_picture){
            userData.profile_picture = 'default.jpg';
        }else{
            const profile_picture = validation.sanitizeString(data.profile_picture);
        }

        //about me

        if(userData.abt_me){
            const aboutMe = validation.sanitizeString(data.abt_me);
        }

    },


    // Validate post data
    validatePost: (data) => {
        const errors = [];

        if (!validation.isRequired(data.title)) {
            errors.push("Title is required");
        } else if (!validation.minLength(data.title, 3)) {
            errors.push("Title must be at least 3 characters long");
        }

        if (!validation.isRequired(data.content)) {
            errors.push("Content is required");
        }

        if (!validation.isRequired(data.user_id) || !validation.isNumber(data.user_id)) {
            errors.push("A valid user ID is required");
        }

        return errors.length > 0 ? errors : null;
    },
};

module.exports = validation;
