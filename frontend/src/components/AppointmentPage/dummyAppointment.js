// src/data/appointmentsData.js

// ---------------------
// DOCTOR APPOINTMENTS
// ---------------------
export const appointments = [
  {
    id: 1,
    doctor: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "12 Years",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
    date: "25 Nov 2025",
    time: "11:30 AM",
    payment: "Online",
    // explicit status:
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Anuj Verma",
    specialization: "Dermatologist",
    experience: "9 Years",
    image:
      "https://t4.ftcdn.net/jpg/07/07/89/33/360_F_707893394_5DEhlBjWOmse1nyu0rC9T7ZRvsAFDkYC.jpg",
    date: "26 Nov 2025",
    time: "03:00 PM",
    payment: "Cash",
    // still using old boolean style also supported
    confirmed: false,
  },
  {
    id: 3,
    doctor: "Dr. Riya Mehta",
    specialization: "Neurologist",
    experience: "15 Years",
    image:
      "https://i.pinimg.com/736x/c5/a3/90/c5a3904b38eb241dd03dd30889599dc4.jpg",
    date: "23 Nov 2025",
    time: "10:00 AM",
    payment: "Online",
    status: "Completed", // you can force Completed
  },
  {
    id: 4,
    doctor: "Dr. Sameer Khan",
    specialization: "General Surgeon",
    experience: "8 Years",
    image:
      "https://img.freepik.com/free-photo/portrait-cheerful-male-doctor_171337-1491.jpg?semt=ais_hybrid&w=740&q=80",
    date: "18 Nov 2025",
    time: "01:15 PM",
    payment: "Cash",
    status: "Canceled",
  },
  {
    id: 5,
    doctor: "Dr. Nisha Rao",
    specialization: "Orthopedist",
    experience: "10 Years",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    date: "20 Nov 2025",
    time: "02:00 PM",
    payment: "Online",
    status: "Rescheduled",
    rescheduledTo: { date: "16 Dec 2027", time: "04:00 PM" },
  },
];

// ---------------------
// SERVICE BOOKINGS
// ---------------------
export const bookedServices = [
  {
    id: 1,
    name: "Blood Sugar Test",
    image:
      "https://media.istockphoto.com/id/491965869/photo/woman-doing-blood-sugar-test.jpg?s=612x612&w=0&k=20&c=gC9xmTjGtB7M9HbCv1_bRkMOsR_dmcycDEH5ioDEp8Q=",
    price: 199,
    date: "21 Nov 2025",
    time: "09:00 AM",
    payment: "Cash",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Blood Pressure Test",
    image:
      "https://m.media-amazon.com/images/I/6180738vAmL._AC_UF350,350_QL80_.jpg",
    price: 149,
    date: "28 Nov 2025",
    time: "11:00 AM",
    payment: "Online",
    status: "Pending",
  },
  {
    id: 3,
    name: "Eye Check-up",
    image:
      "https://media.istockphoto.com/id/1140521075/photo/tuning-the-intrument-little-boy-with-phoropter-having-testing-his-eyes-in-the-doctors-office.jpg?s=612x612&w=0&k=20&c=vVWaRrp43NcqW28tYAl9xgp98BaZsJiy5A1NIRwWUlA=",
    price: 399,
    date: "18 Nov 2025",
    time: "03:00 PM",
    payment: "Cash",
    status: "Completed",
  },
  {
    id: 4,
    name: "Thyroid Test",
    image:
      "https://media.istockphoto.com/id/1415813531/photo/biochemist-of-doctor-holds-blood-sample-for-t3-t4-tsh-test-in-laboratory-background.jpg?s=612x612&w=0&k=20&c=gox_qnA11yPNG5ez0kGKAiy2NWMTjnoIR658bqAzc5Y=",
    price: 399,
    date: "28 Nov 2025",
    time: "06:00 PM",
    payment: "Online",
    status: "Rescheduled",
    rescheduledTo: { date: "29 Nov 2026", time: "06:00 PM" },
  },
  {
    id: 4,
    name: "Thyroid Test",
    image:
      "https://media.istockphoto.com/id/1415813531/photo/biochemist-of-doctor-holds-blood-sample-for-t3-t4-tsh-test-in-laboratory-background.jpg?s=612x612&w=0&k=20&c=gox_qnA11yPNG5ez0kGKAiy2NWMTjnoIR658bqAzc5Y=",
    price: 399,
    date: "28 Nov 2025",
    time: "06:00 PM",
    payment: "Online",
    status: "Rescheduled",
    rescheduledTo: { date: "30 Nov 2026", time: "06:00 PM" },
  },
];
