import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        nic,
        dob,
        role,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !nic ||
        !dob ||
        !role
    ) {
        return next(new ErrorHandler(400, "Please Fill All Fields"));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler(400, "User Already Exists"));
    }
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        nic,
        dob,
        role,
    });
    generateToken(user, 200, "Patient Registered Successfully", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler(400, "Please Enter Email and Password"));
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler(400, "Password and Confirm Password are not same")
        );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler(400, "Invalid Email or Password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler(400, "Invalid Email or Password"));
    }
    if (role !== user.role) {
        return next(new ErrorHandler(400, "Invalid Role"));
    }
    generateToken(user, "Login Successfully", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } =
        req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !nic ||
        !dob
    ) {
        return next(new ErrorHandler(400, "Please Fill All Fields"));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(
            new ErrorHandler(
                400,
                `${isRegistered.role} With This Email Already Exists`
            )
        );
    }
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "admin",
    });
    res.status(200).json({
        succes: true,
        message: " New Admin Registered Successfully",
    });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});
