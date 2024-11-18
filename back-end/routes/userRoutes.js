import multer from 'multer';
import express from 'express';

// Import controllers using ES module syntax
import {
  registerController,
  loginController,
  authController,
  docController,
  deleteallnotificationController,
  getallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  downloadDocController,
} from '../controllers/userC.js';  // Ensure the correct file extension

// Import middleware using ES module syntax
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getuserdata", authController);

router.post("/registerdoc",  docController); //for doctor registration

router.get("/getalldoctors", authMiddleware, getAllDoctorsControllers);

router.post("/getappointment",upload.single("image"), authMiddleware, appointmentController);

router.post(
  "/getallnotification",
  authMiddleware,
  getallnotificationController
);

router.post(
  "/deleteallnotification",
  authMiddleware,
  deleteallnotificationController
);

router.get("/getuserappointments", authMiddleware, getAllUserAppointments);

router.get("/getDocsforuser", authMiddleware, getDocsController)

router.get("/documents/download/:filename", authMiddleware, downloadDocController);





export default router;


