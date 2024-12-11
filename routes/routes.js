import controller from "../controllers/controller.js";
import { isAuthenticatedDriver, isNotAuthenticated, isUserAdmin, isAuthenticatedExaminer } from "../middleWare/authMiddleWare.js";

import express from "express";

const router = express.Router();

router.get("/", controller.dashboard_get);

router.get("/g-test", isAuthenticatedDriver, controller.g_test_get);

router.post("/g-test/:user_id_to_update", isAuthenticatedDriver, controller.g_test_update);

router.get("/g2-test", isAuthenticatedDriver, controller.g2_test_get);

router.post("/g2-test/:user_id_to_update", isAuthenticatedDriver, controller.g2_test_post);

router.get("/appointment", isUserAdmin, controller.appointment_get);

router.post("/appointment", isUserAdmin, controller.appointment_post);

router.post("/appointments/available", isAuthenticatedDriver, controller.available_time_slots_post);

router.post("/appointments/book", isAuthenticatedDriver, controller.book_appointment_post);

router.get("/examiner", isAuthenticatedExaminer, controller.examiner_get);

router.post("/examiner/:driver_id", isAuthenticatedExaminer, controller.examiner_update);

router.get("/admin/results", isUserAdmin, controller.admin_results_get);

router.get("/login", isNotAuthenticated, controller.login_get);

router.post("/login", controller.login_post);

router.post("/signup", controller.signup_post);

router.get("/logout", controller.logout_get);

router.get("*", controller.not_found);

export default router;