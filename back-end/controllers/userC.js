import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import userModel from '../schemas/userModel.js'; // Ensure this is the actual Mongoose model
import docModel from '../schemas/docModel.js';
import appointmentSchema from '../schemas/appointmentModel.js';

dotenv.config();

// Utility to generate JWT tokens
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email }); // Correct usage of model
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ fullName, email, password: hashedPassword });

    await newUser.save();

    const token = generateToken({ id: newUser._id, email: newUser.email });
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Correct usage of `findOne`
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ message: 'Invalid email or password', success: false });
    }

    const token = generateToken({ id: user._id, email: user.email });
    user.password = undefined; // Exclude password from response

    return res.status(200).send({
      message: 'Login successful',
      success: true,
      userData: user,
      token: token,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).send({ success: false, message: 'Server error', error });
  }
};


// Auth Controller
export const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Doctor Registration Controller
export const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docModel({ ...doctor, userId, status: 'pending' });
    await newDoctor.save();

        // Find admin user (adjust this if admin is part of userModel)
        const adminUser = await userModel.findOne({ type: 'admin' });
        if (adminUser) {
          adminUser.notification.push({
            type: 'apply-doctor-request',
            message: `${doctor.fullName} has applied for doctor registration`,
            data: { userId: newDoctor._id, fullName: doctor.fullName, onClickPath: '/admin/doctors' },
          });
          await adminUser.save();
        }
    
        res.status(201).send({ success: true, message: 'Doctor registration request sent successfully' });
      } catch (error) {
        console.error('Doctor Registration Error:', error.message);
        res.status(500).send({ message: 'Server error', success: false });
      }
    };
    

// Notifications Controllers
export const getallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    res.status(200).send({ success: true, message: 'All notifications marked as read', data: user });
  } catch (error) {
    console.error('Notification Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

export const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notification = [];
    user.seennotification = [];
    await user.save();

    res.status(200).send({ success: true, message: 'All notifications deleted', data: user });
  } catch (error) {
    console.error('Notification Deletion Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Appointment Controllers
export const appointmentController = async (req, res) => {
  try {
    const { userInfo, doctorInfo, date, userId, doctorId } = req.body;
    const newAppointment = new appointmentSchema({
      userInfo: JSON.parse(userInfo),
      doctorInfo: JSON.parse(doctorInfo),
      date,
      userId,
      doctorId,
      status: 'pending',
    });

    if (req.file) {
      newAppointment.document = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    await newAppointment.save();
    res.status(200).send({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Appointment Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get All Doctors
export const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({ status: 'approved' });
    res.status(200).send({ success: true, data: doctors });
  } catch (error) {
    console.error('Doctor Retrieval Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Document Download Controller
export const downloadDocController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const document = user.documents.find((doc) => doc.filename === req.params.filename);

    if (!document) {
      return res.status(404).send({ success: false, message: 'Document not found' });
    }

    const filePath = path.resolve(`uploads/${document.filename}`);
    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    } else {
      res.status(404).send({ message: 'File not found', success: false });
    }
  } catch (error) {
    console.error('Document Download Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get All User Appointments Controller
export const getAllUserAppointments = async (req, res) => {
  try {
    const { userId } = req.body; // Ensure the userId is sent in the request body

    const appointments = await appointmentSchema.find({ userId }).populate('doctorInfo');
    if (!appointments.length) {
      return res.status(404).send({
        success: false,
        message: 'No appointments found for this user',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('Get User Appointments Error:', error.message);
    res.status(500).send({
      success: false,
      message: 'Server error while retrieving appointments',
      error: error.message,
    });
  }
};

// Get All Doctors (Admin or Approved List) Controller
export const getDocsController = async (req, res) => {
  try {
    const { adminView } = req.query; // Optional adminView to fetch all doctors

    const query = adminView === 'true' ? {} : { status: 'approved' };
    const doctors = await docModel.find(query);

    if (!doctors.length) {
      return res.status(404).send({
        success: false,
        message: 'No doctors found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
    });
  } catch (error) {
    console.error('Get Doctors Error:', error.message);
    res.status(500).send({
      success: false,
      message: 'Server error while retrieving doctors',
      error: error.message,
    });
  }
};

