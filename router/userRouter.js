import express from "express";
import {
    isAdminAuthenticated,
    isPatientAuthenticated,
} from "../middlewares/auth.js";
import {
    addNewAdmin,
    getAllDoctors,
    getUserDetails,
    login,
    patientRegister,
} from "../controller/userController.js";

const router = express.Router();
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

export default router;
