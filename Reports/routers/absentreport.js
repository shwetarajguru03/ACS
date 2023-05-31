const express = require('express');
const router = express.Router();

// Import the User and Empdata models
const User = require('/ACS_backend/Attendance/models/user');
const Empdata = require('/ACS_backend/Reports/models/empdata');
const Absentreport = require('/ACS_backend/Reports/models/absentreport');

// Define the API route to fetch absent report data by empid
router.get('/absentreport/:empid', async (req, res) => {
  const empid = req.params.empid;

  try {
    // Find the user by empid and retrieve the required fields
    const user = await User.findOne({ empid }, 'empid name designation department');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the empdata by empid and retrieve the required fields
    const empdata = await Empdata.findOne({ empid }, 'date shift');

    if (!empdata) {
      return res.status(404).json({ error: 'Empdata not found' });
    }

    // Create a new absent report in the Absentreport collection
    const absentReport = new Absentreport({
      empid: user.empid,
      name: user.name,
      designation: user.designation,
      department: user.department,
      date: empdata.date,
      shift: empdata.shift
    });

    // Save the absent report
    await absentReport.save();

    res.json({ user, empdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
