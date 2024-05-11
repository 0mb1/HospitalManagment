import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
        type: String,
        required: [true, "last Name is required"],
        minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
        type: String,
        required: [true, "Phone Number is required"],
        minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
        maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },
    nic: {
        type: String,
        required: [true, "NIC is required"],
        minLength: [13, " NIC Must Contain 13 Digits!"],
        maxLength: [13, "NIC Must Contain 13 Digits!"],
    },

    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password Must Contain At Least 6 Characters!"],
        select: false,
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["Admin", "Patient", "Doctor"],
    },
    doctorDepartment: {
        type: String,
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return (
        jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY),
        {
            expiresIN: process.env.JWT_EXPIRES,
        }
    );
};

export const User = mongoose.model("User", userSchema);
