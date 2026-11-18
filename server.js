
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3000;

let leaves = [
    {
        id: 701,
        employeeName: "Ananya Singh",
        employeeCode: "EMP101",
        leaveType: "Casual",
        days: 2,
        status: "Pending"
    },
    {
        id: 702,
        employeeName: "Rahul Verma",
        employeeCode: "EMP102",
        leaveType: "Sick",
        days: 1,
        status: "Approved"
    },
    {
        id: 703,
        employeeName: "Simran Kaur",
        employeeCode: "EMP103",
        leaveType: "Earned",
        days: 3,
        status: "Rejected"
    }
];

function validateLeave(data) {

    if (
        !data ||
        typeof data.employeeName !== "string" ||
        !data.employeeName.trim() ||
        typeof data.employeeCode !== "string" ||
        !data.employeeCode.trim() ||
        !["Casual", "Sick", "Earned"].includes(data.leaveType) ||
        !Number.isInteger(data.days) ||
        data.days <= 0 ||
        !["Pending", "Approved", "Rejected"].includes(data.status)
    ) {
        return false;
    }

    return true;
}

app.get('/api/leaves', (req, res) => {
    res.status(200).json(leaves);
});

app.post('/api/leaves', (req, res) => {

    const data = req.body;

    if (!validateLeave(data)) {
        return res.status(400).json({
            message: "Invalid leave data"
        });
    }

    const newId = leaves.length > 0
        ? Math.max(...leaves.map(item => item.id)) + 1
        : 1;

    const newLeave = {
        ...data,
        id: newId
    };

    leaves.push(newLeave);

    res.status(201).json(newLeave);
});

app.get('/api/leaves/filter', (req, res) => {

    const status = req.query.status;

    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    const result = leaves.filter(item =>
        item.status.toLowerCase() === status.toLowerCase()
    );

    res.status(200).json(result);
});

app.get('/api/leaves/pending', (req, res) => {

    const result = leaves.filter(item =>
        item.status === "Pending"
    );

    res.status(200).json(result);
});

app.get('/api/leaves/:id', (req, res) => {

    const id = Number(req.params.id);

    const leave = leaves.find(item => item.id === id);

    if (!leave) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    res.status(200).json(leave);
});

app.put('/api/leaves/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    if (!validateLeave(req.body)) {
        return res.status(400).json({
            message: "Invalid leave data"
        });
    }

    leaves[index] = {
        ...req.body,
        id: id
    };

    res.status(200).json(leaves[index]);
});

app.delete('/api/leaves/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    leaves.splice(index, 1);

    res.status(200).json({
        message: "Leave record deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
