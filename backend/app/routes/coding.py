from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Student, ProgrammingProgress, DSAProgress
from app.auth.deps import get_current_student

router = APIRouter(prefix="/coding", tags=["Skills & Technical Competencies"])

# Department Domain Curriculums
DEPARTMENT_SKILLS_DATA = {
    "ECE": {
        "title": "Hardware & Embedded Systems Competencies",
        "category_label": "Core Hardware Skills",
        "topic_category": "ECE Technical Domains",
        "skills": [
            {
                "name": "Embedded Systems",
                "icon": "cpu",
                "level": "Advanced",
                "score": 92.0,
                "completion": 90.0,
                "attempted": 120,
                "solved": 110,
                "accuracy": 91.7,
                "completed_topics": ["Microcontroller Architecture", "UART/SPI/I2C Buses", "Sensor Interfacing", "Interrupt Service Routines", "Device Drivers", "Low Power Modes", "Memory Mapping", "Hardware Timers", "Watchdog Timers"],
                "pending_topics": ["Peripheral DMA Integration"]
            },
            {
                "name": "VLSI & Chip Design",
                "icon": "layers",
                "level": "Proficient",
                "score": 86.0,
                "completion": 80.0,
                "attempted": 100,
                "solved": 86,
                "accuracy": 86.0,
                "completed_topics": ["CMOS Inverter Fundamentals", "Combinational Logic Synthesis", "Sequential Circuit Timing", "Setup & Hold Violations", "ASIC Design Flow", "Static Timing Analysis", "Layout & DRC/LVS", "Low-Power RTL"],
                "pending_topics": ["Clock Tree Synthesis", "Floorplanning"]
            },
            {
                "name": "RTOS",
                "icon": "activity",
                "level": "Advanced",
                "score": 88.0,
                "completion": 90.0,
                "attempted": 90,
                "solved": 80,
                "accuracy": 88.9,
                "completed_topics": ["Task Scheduling & Preemption", "Semaphores & Mutexes", "Message Queues", "Priority Inversion & Inheritance", "FreeRTOS Porting", "Interrupt Handling in RTOS", "Event Groups", "Real-Time Deadlines", "Inter-Task Communication"],
                "pending_topics": ["Memory Management Units"]
            },
            {
                "name": "Microcontrollers",
                "icon": "terminal",
                "level": "Advanced",
                "score": 94.0,
                "completion": 100.0,
                "attempted": 110,
                "solved": 104,
                "accuracy": 94.5,
                "completed_topics": ["ARM Cortex-M Architecture", "GPIO Configuration", "ADC/DAC Conversions", "DMA Controllers", "PWM Signal Generation", "Flash Memory Operations", "JTAG/SWD Debugging", "Nested Vectored Interrupts", "Bootloader Design", "Power Management"],
                "pending_topics": []
            },
            {
                "name": "Verilog & SystemVerilog",
                "icon": "code-2",
                "level": "Proficient",
                "score": 84.0,
                "completion": 80.0,
                "attempted": 95,
                "solved": 80,
                "accuracy": 84.2,
                "completed_topics": ["Module Declarations & Ports", "Behavioral Modeling", "Structural RTL", "Non-blocking vs Blocking", "Finite State Machines", "Testbench Verification", "Assertion-Based Verification", "Clock Domain Crossing"],
                "pending_topics": ["Synthesis Pragmas", "Parameterized Interfaces"]
            },
            {
                "name": "FPGA Prototyping",
                "icon": "cpu",
                "level": "Proficient",
                "score": 82.0,
                "completion": 80.0,
                "attempted": 85,
                "solved": 70,
                "accuracy": 82.4,
                "completed_topics": ["Xilinx/Altera Architecture", "Look-Up Tables & Flip-Flops", "Block RAM Configuration", "DSP Slices", "Timing Constraints (XDC)", "Bitstream Generation", "Hardware Debugging with ILA", "Vivado Workflow"],
                "pending_topics": ["Soft-Core Processors", "High-Speed SerDes"]
            },
            {
                "name": "IoT & Wireless Protocols",
                "icon": "wifi",
                "level": "Advanced",
                "score": 90.0,
                "completion": 90.0,
                "attempted": 105,
                "solved": 95,
                "accuracy": 90.5,
                "completed_topics": ["ESP32/Nordic SoC Platforms", "MQTT & CoAP Communication", "Bluetooth Low Energy (BLE)", "Wi-Fi Stack Integration", "Sensor Telemetry Pipelines", "Edge Signal Conditioning", "Secure TLS for IoT", "Over-The-Air (OTA) Updates", "Cloud Ingestion"],
                "pending_topics": ["Power Harvesting Techniques"]
            }
        ],
        "topics": [
            {"id": 1, "topic_name": "Analog Circuits & Op-Amps", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 92.0, "assessment_score": 90.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 2, "topic_name": "Digital Logic & Sequential FSMs", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 94.0, "assessment_score": 93.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 3, "topic_name": "Signals & Systems Transforms", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 88.0, "assessment_score": 86.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 4, "topic_name": "DSP Filter Design & FFT", "category": "Core", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 85.0, "assessment_score": 84.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 5, "topic_name": "Embedded C Hardware Drivers", "category": "Core", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 95.0, "assessment_score": 94.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 6, "topic_name": "Microprocessor Architecture", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 89.0, "assessment_score": 88.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 7, "topic_name": "Verilog RTL Modeling", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 84.0, "assessment_score": 83.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 8, "topic_name": "FPGA Bitstream & Synthesis", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 82.0, "assessment_score": 81.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 9, "topic_name": "FreeRTOS Kernel Scheduling", "category": "Advanced", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 90.0, "assessment_score": 89.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 10, "topic_name": "Static Timing Analysis (STA)", "category": "Advanced", "completed_problems": 7, "total_problems": 10, "completion_pct": 70.0, "accuracy_pct": 78.0, "assessment_score": 76.0, "skill_level": "Developing", "status": "In Progress"},
            {"id": 11, "topic_name": "IoT Edge MQTT Telemetry", "category": "Advanced", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 91.0, "assessment_score": 90.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 12, "topic_name": "High-Speed PCB & Signal Integrity", "category": "Advanced", "completed_problems": 6, "total_problems": 10, "completion_pct": 60.0, "accuracy_pct": 75.0, "assessment_score": 72.0, "skill_level": "Developing", "status": "In Progress"}
        ]
    },
    "EEE": {
        "title": "Electrical Engineering Core Competencies",
        "category_label": "Core Electrical Skills",
        "topic_category": "EEE Technical Domains",
        "skills": [
            {
                "name": "Power Systems",
                "icon": "zap",
                "level": "Advanced",
                "score": 90.0,
                "completion": 90.0,
                "attempted": 110,
                "solved": 100,
                "accuracy": 90.9,
                "completed_topics": ["Load Flow Analysis", "Fault Calculations", "Power Grid Stability", "Transmission Line Modeling", "HVDC Transmission", "Switchgear & Protection", "Smart Grids", "Economic Dispatch", "Relay Coordination"],
                "pending_topics": ["Renewable Integration Dynamics"]
            },
            {
                "name": "Control Systems",
                "icon": "activity",
                "level": "Advanced",
                "score": 88.0,
                "completion": 90.0,
                "attempted": 95,
                "solved": 84,
                "accuracy": 88.4,
                "completed_topics": ["Transfer Functions", "Root Locus Analysis", "Bode & Nyquist Plots", "PID Controller Tuning", "State-Space Representation", "Controllability & Observability", "Digital Controllers", "Feedback Stability", "Phase Margin Optimization"],
                "pending_topics": ["Non-linear Control Systems"]
            },
            {
                "name": "Electrical Machines",
                "icon": "cpu",
                "level": "Proficient",
                "score": 86.0,
                "completion": 80.0,
                "attempted": 100,
                "solved": 86,
                "accuracy": 86.0,
                "completed_topics": ["Transformer Equivalent Circuits", "3-Phase Induction Motors", "Synchronous Alternators", "BLDC Motor Drives", "DC Machine Dynamics", "Machine Testing & Losses", "Magnetic Circuit Analysis", "Speed Control Methods"],
                "pending_topics": ["Torque-Speed Modeling", "Special Electrical Motors"]
            },
            {
                "name": "Circuit Design & Simulation",
                "icon": "layers",
                "level": "Advanced",
                "score": 92.0,
                "completion": 100.0,
                "attempted": 115,
                "solved": 106,
                "accuracy": 92.2,
                "completed_topics": ["Kirchhoff Laws & Network Theorems", "Transient & Steady-State Analysis", "SPICE Simulation", "RLC Resonance", "Op-Amp Filter Design", "Analog Signal Conditioning", "Two-Port Networks", "Magnetics & Inductors", "PCB Schematic Capture", "Grounding Techniques"],
                "pending_topics": []
            },
            {
                "name": "Power Electronics",
                "icon": "zap",
                "level": "Proficient",
                "score": 84.0,
                "completion": 80.0,
                "attempted": 90,
                "solved": 76,
                "accuracy": 84.4,
                "completed_topics": ["Buck/Boost DC-DC Converters", "Inverters (VSI/CSI)", "Thyristor Rectifiers", "MOSFET/IGBT Gate Drivers", "PWM Switching Schemes", "Thermal Management & Heat Sinks", "EMI/EMC Filtering", "Soft Switching (ZVS/ZCS)"],
                "pending_topics": ["Matrix Converters", "Power Factor Correction"]
            }
        ],
        "topics": [
            {"id": 1, "topic_name": "Circuit Theorems & Analysis", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 94.0, "assessment_score": 92.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 2, "topic_name": "Electromagnetic Field Theory", "category": "Fundamentals", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 88.0, "assessment_score": 86.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 3, "topic_name": "Transformer Principles & Testing", "category": "Core", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 91.0, "assessment_score": 90.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 4, "topic_name": "AC Motors & Alternator Modeling", "category": "Core", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 85.0, "assessment_score": 84.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 5, "topic_name": "Power System Transmission & Grid", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 90.0, "assessment_score": 89.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 6, "topic_name": "Switchgear & Numerical Relays", "category": "Core", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 84.0, "assessment_score": 82.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 7, "topic_name": "DC-DC Converters & Inverters", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 85.0, "assessment_score": 83.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 8, "topic_name": "PID Tuning & State Space Control", "category": "Algorithms", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 89.0, "assessment_score": 88.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 9, "topic_name": "Industrial Drives & EV Powertrain", "category": "Advanced", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 86.0, "assessment_score": 85.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 10, "topic_name": "PLC & SCADA Automation", "category": "Advanced", "completed_problems": 7, "total_problems": 10, "completion_pct": 70.0, "accuracy_pct": 80.0, "assessment_score": 78.0, "skill_level": "Developing", "status": "In Progress"}
        ]
    },
    "MECH": {
        "title": "Mechanical Engineering Core Competencies",
        "category_label": "Core Mechanical Skills",
        "topic_category": "Mechanical Technical Domains",
        "skills": [
            {
                "name": "CAD/CAM & 3D Modeling",
                "icon": "layers",
                "level": "Advanced",
                "score": 94.0,
                "completion": 100.0,
                "attempted": 120,
                "solved": 112,
                "accuracy": 93.3,
                "completed_topics": ["SolidWorks/CATIA Parametric Modeling", "GD&T Tolerancing", "Assembly Constraint Modeling", "Surface Modeling", "CAM Toolpath Generation", "CNC G-Code Programming", "Rapid Prototyping", "Sheet Metal Design", "Reverse Engineering", "Drafting Standards"],
                "pending_topics": []
            },
            {
                "name": "Thermodynamics & Thermal Systems",
                "icon": "flame",
                "level": "Advanced",
                "score": 88.0,
                "completion": 90.0,
                "attempted": 100,
                "solved": 88,
                "accuracy": 88.0,
                "completed_topics": ["First & Second Laws", "Rankine & Brayton Cycles", "IC Engine Heat Balance", "Heat Transfer (Conduction/Convection/Radiation)", "HVAC & Refrigeration Cycles", "Compressible Fluid Flow", "Combustion Chemistry", "Heat Exchanger Design", "Entropy & Exergy Analysis"],
                "pending_topics": ["Computational Thermal Simulation"]
            },
            {
                "name": "Manufacturing Processes",
                "icon": "tool",
                "level": "Proficient",
                "score": 86.0,
                "completion": 80.0,
                "attempted": 95,
                "solved": 82,
                "accuracy": 86.3,
                "completed_topics": ["Metal Casting & Solidification", "Machining & Cutting Mechanics", "Welding & Metallurgy", "Sheet Metal Forming", "Additive Manufacturing / 3D Printing", "Injection Molding", "Quality Control & Metrology", "Non-Destructive Testing (NDT)"],
                "pending_topics": ["Lean Manufacturing", "Six Sigma Optimization"]
            },
            {
                "name": "Machine Design & FEA",
                "icon": "cpu",
                "level": "Proficient",
                "score": 85.0,
                "completion": 80.0,
                "attempted": 90,
                "solved": 76,
                "accuracy": 84.4,
                "completed_topics": ["Stress & Strain Analysis (Mohr's Circle)", "Fatigue & Fracture Mechanics", "Gear Trains & Planetary Gears", "Bearing Selection & Lubrication", "Shaft & Keyway Sizing", "Spring & Fastener Design", "Finite Element Analysis (FEA)", "Kinematic Linkages"],
                "pending_topics": ["Vibration & Modal Analysis", "Failure Theories (Von Mises)"]
            },
            {
                "name": "Robotics & Industrial Automation",
                "icon": "activity",
                "level": "Advanced",
                "score": 90.0,
                "completion": 90.0,
                "attempted": 105,
                "solved": 95,
                "accuracy": 90.5,
                "completed_topics": ["Forward & Inverse Kinematics", "Industrial Manipulators (6-DOF)", "Pneumatics & Hydraulics", "PLC Programming", "Sensor Integration (Encoders/Vision)", "Motion Planning", "Gripper Design", "Autonomous Mobile Robots (AMR)", "Actuator Selection"],
                "pending_topics": ["Industrial Safety Interlocks"]
            }
        ],
        "topics": [
            {"id": 1, "topic_name": "Engineering Mechanics & Statics", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 95.0, "assessment_score": 93.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 2, "topic_name": "Strength of Materials & Mohr Circle", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 92.0, "assessment_score": 90.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 3, "topic_name": "Fluid Mechanics & Bernoulli Flow", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 88.0, "assessment_score": 87.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 4, "topic_name": "Heat Transfer Conduction & Radiation", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 89.0, "assessment_score": 88.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 5, "topic_name": "Kinematics & Dynamics of Machinery", "category": "Core", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 86.0, "assessment_score": 84.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 6, "topic_name": "CAD Solid Modeling & Drafting", "category": "Core", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 96.0, "assessment_score": 95.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 7, "topic_name": "Finite Element Stress Simulation", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 85.0, "assessment_score": 83.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 8, "topic_name": "CNC Toolpath G-Code Generation", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 87.0, "assessment_score": 86.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 9, "topic_name": "Robotics Manipulator Kinematics", "category": "Advanced", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 90.0, "assessment_score": 89.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 10, "topic_name": "Hydraulics & PLC Automation", "category": "Advanced", "completed_problems": 7, "total_problems": 10, "completion_pct": 70.0, "accuracy_pct": 81.0, "assessment_score": 79.0, "skill_level": "Developing", "status": "In Progress"}
        ]
    },
    "CIVIL": {
        "title": "Civil Engineering Core Competencies",
        "category_label": "Core Civil Skills",
        "topic_category": "Civil Technical Domains",
        "skills": [
            {
                "name": "Structural Design & Analysis",
                "icon": "building",
                "level": "Advanced",
                "score": 92.0,
                "completion": 90.0,
                "attempted": 110,
                "solved": 102,
                "accuracy": 92.7,
                "completed_topics": ["RCC Slab & Beam Design", "Steel Frame Connections", "STAAD.Pro / ETABS Modeling", "Limit State Method", "Earthquake Resistant Design (IS 1893)", "Wind Load Calculations", "Retaining Walls", "Pre-stressed Concrete", "Structural Detailing"],
                "pending_topics": ["Foundation Design (Raft/Pile)"]
            },
            {
                "name": "Surveying & Geomatics",
                "icon": "compass",
                "level": "Advanced",
                "score": 90.0,
                "completion": 90.0,
                "attempted": 100,
                "solved": 90,
                "accuracy": 90.0,
                "completed_topics": ["Total Station Operations", "GPS & GNSS Mapping", "Levelling & Contouring", "Theodolite Traversing", "Drone Photogrammetry", "GIS Spatial Analysis (QGIS)", "Remote Sensing Interpretation", "Error Adjustments", "Curve Setting"],
                "pending_topics": ["Hydrographic Surveying"]
            },
            {
                "name": "Construction Management & BOQ",
                "icon": "layers",
                "level": "Proficient",
                "score": 86.0,
                "completion": 80.0,
                "attempted": 95,
                "solved": 82,
                "accuracy": 86.3,
                "completed_topics": ["Quantity Surveying & BOQ", "CPM / PERT Project Scheduling", "Contract Administration & Tenders", "Primavera P6 / MS Project", "Construction Safety Protocols", "Equipment Utilization", "Cost Control & Cashflow", "Green Building (LEED)"],
                "pending_topics": ["Resource Leveling", "Quality Assurance Standards"]
            },
            {
                "name": "AutoCAD & Civil BIM Tools",
                "icon": "tool",
                "level": "Advanced",
                "score": 94.0,
                "completion": 100.0,
                "attempted": 115,
                "solved": 108,
                "accuracy": 93.9,
                "completed_topics": ["2D Architectural Drafting", "Revit BIM 3D Modeling", "Civil 3D Road Alignment", "Structural Rebar Detailing", "Clash Detection (Navisworks)", "Topographical Surfaces", "Drainage Network Modeling", "Section & Elevation Generation", "Parametric Families", "Rendering & Walkthroughs"],
                "pending_topics": []
            },
            {
                "name": "Geotechnical & Foundation Engineering",
                "icon": "layers",
                "level": "Proficient",
                "score": 85.0,
                "completion": 80.0,
                "attempted": 90,
                "solved": 77,
                "accuracy": 85.6,
                "completed_topics": ["Soil Mechanics & Classification", "Permeability & Seepage (Flownets)", "Shear Strength (Triaxial Testing)", "Consolidation & Settlement", "Slope Stability Analysis", "Deep Foundations (Pile Groups)", "Soil Stabilization Methods", "Retaining Earth Pressure"],
                "pending_topics": ["Ground Improvement Techniques", "Geophysical Exploration"]
            }
        ],
        "topics": [
            {"id": 1, "topic_name": "Structural Mechanics & Bending", "category": "Fundamentals", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 94.0, "assessment_score": 92.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 2, "topic_name": "Fluid Mechanics & Open Channel Flow", "category": "Fundamentals", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 89.0, "assessment_score": 88.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 3, "topic_name": "RCC Beam & Column Design (IS 456)", "category": "Core", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 93.0, "assessment_score": 91.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 4, "topic_name": "Soil Shear Strength & Triaxial", "category": "Core", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 87.0, "assessment_score": 86.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 5, "topic_name": "Total Station & Drone Surveying", "category": "Core", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 95.0, "assessment_score": 94.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 6, "topic_name": "Highway Alignment & Pavement", "category": "Core", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 85.0, "assessment_score": 84.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 7, "topic_name": "STAAD.Pro Frame Matrix Analysis", "category": "Algorithms", "completed_problems": 8, "total_problems": 10, "completion_pct": 80.0, "accuracy_pct": 86.0, "assessment_score": 84.0, "skill_level": "Proficient", "status": "In Progress"},
            {"id": 8, "topic_name": "CPM / PERT Network Scheduling", "category": "Algorithms", "completed_problems": 9, "total_problems": 10, "completion_pct": 90.0, "accuracy_pct": 90.0, "assessment_score": 89.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 9, "topic_name": "Revit BIM Structural Detailing", "category": "Advanced", "completed_problems": 10, "total_problems": 10, "completion_pct": 100.0, "accuracy_pct": 95.0, "assessment_score": 94.0, "skill_level": "Mastered", "status": "Completed"},
            {"id": 10, "topic_name": "Environmental Water Treatment", "category": "Advanced", "completed_problems": 7, "total_problems": 10, "completion_pct": 70.0, "accuracy_pct": 80.0, "assessment_score": 78.0, "skill_level": "Developing", "status": "In Progress"}
        ]
    }
}

@router.get("/languages")
def get_programming_languages_progress(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    dept_code = current_student.dept_code.upper() if current_student.dept_code else "CSE"
    is_core = dept_code in ["ECE", "EEE", "MECH", "CIVIL"]
    
    # If core department student, return their own domain technical skills (Zero CSE leakage!)
    if is_core and dept_code in DEPARTMENT_SKILLS_DATA:
        domain_data = DEPARTMENT_SKILLS_DATA[dept_code]
        results = []
        for idx, skill in enumerate(domain_data["skills"]):
            results.append({
                "id": idx + 1,
                "language_name": skill["name"],
                "icon_name": skill["icon"],
                "topics_completed": len(skill["completed_topics"]),
                "total_topics": len(skill["completed_topics"]) + len(skill["pending_topics"]),
                "completion_pct": skill["completion"],
                "assessment_score": skill["score"],
                "questions_attempted": skill["attempted"],
                "questions_solved": skill["solved"],
                "accuracy_pct": skill["accuracy"],
                "skill_level": skill["level"],
                "completed_topics": skill["completed_topics"],
                "pending_topics": skill["pending_topics"]
            })
            
        avg_score = round(sum(r["assessment_score"] for r in results) / max(1, len(results)), 1)
        avg_completion = round(sum(r["completion_pct"] for r in results) / max(1, len(results)), 1)
        
        return {
            "department": current_student.department,
            "dept_code": dept_code,
            "is_core_department": True,
            "domain_title": domain_data["title"],
            "category_label": domain_data["category_label"],
            "overall_programming_score": avg_score,
            "overall_completion_pct": avg_completion,
            "languages": results
        }

    # For CSE-Cluster (CSE, IT, AIML, AIDS)
    progress_records = db.query(ProgrammingProgress).filter(
        ProgrammingProgress.student_id == current_student.id
    ).all()
    
    results = []
    for p in progress_records:
        lang_name = p.language.name if p.language else "Unknown"
        icon_name = p.language.icon_name if p.language else "code"
        results.append({
            "id": p.id,
            "language_name": lang_name,
            "icon_name": icon_name,
            "topics_completed": p.topics_completed,
            "total_topics": p.total_topics,
            "completion_pct": p.completion_pct,
            "assessment_score": p.assessment_score,
            "questions_attempted": p.questions_attempted,
            "questions_solved": p.questions_solved,
            "accuracy_pct": p.accuracy_pct,
            "skill_level": p.skill_level,
            "completed_topics": p.completed_topics_list or [],
            "pending_topics": p.pending_topics_list or []
        })
        
    avg_score = round(sum(r["assessment_score"] for r in results) / max(1, len(results)), 1)
    avg_completion = round(sum(r["completion_pct"] for r in results) / max(1, len(results)), 1)

    return {
        "department": current_student.department,
        "dept_code": dept_code,
        "is_core_department": False,
        "domain_title": "Programming Languages & Software Curriculum",
        "category_label": "Programming Languages",
        "overall_programming_score": avg_score,
        "overall_completion_pct": avg_completion,
        "languages": results
    }

@router.get("/dsa")
def get_dsa_analysis(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    dept_code = current_student.dept_code.upper() if current_student.dept_code else "CSE"
    is_core = dept_code in ["ECE", "EEE", "MECH", "CIVIL"]
    
    # If core department student, return their own core technical topics (Zero CSE DSA leakage!)
    if is_core and dept_code in DEPARTMENT_SKILLS_DATA:
        domain_data = DEPARTMENT_SKILLS_DATA[dept_code]
        topics = domain_data["topics"]
        category_map = {}
        for d in topics:
            cat = d["category"]
            if cat not in category_map:
                category_map[cat] = []
            category_map[cat].append(d)
            
        avg_score = round(sum(t["assessment_score"] for t in topics) / max(1, len(topics)), 1)
        avg_accuracy = round(sum(t["accuracy_pct"] for t in topics) / max(1, len(topics)), 1)
        total_completed = sum(t["completed_problems"] for t in topics)
        total_problems = sum(t["total_problems"] for t in topics)
        
        return {
            "department": current_student.department,
            "dept_code": dept_code,
            "is_core_department": True,
            "domain_title": f"{dept_code} Core Technical Topics Analysis",
            "overall_dsa_score": avg_score,
            "overall_dsa_accuracy": avg_accuracy,
            "total_problems_solved": total_completed,
            "total_curriculum_problems": total_problems,
            "completion_rate_pct": round((total_completed / max(1, total_problems)) * 100.0, 1),
            "topics": topics,
            "by_category": category_map
        }

    # For CSE-Cluster
    dsa_records = db.query(DSAProgress).filter(
        DSAProgress.student_id == current_student.id
    ).order_by(DSAProgress.id.asc()).all()
    
    topics = []
    category_map = {}
    
    for d in dsa_records:
        item = {
            "id": d.id,
            "topic_name": d.topic_name,
            "category": d.category,
            "completed_problems": d.completed_problems,
            "total_problems": d.total_problems,
            "completion_pct": d.completion_pct,
            "accuracy_pct": d.accuracy_pct,
            "assessment_score": d.assessment_score,
            "skill_level": d.skill_level,
            "status": d.status
        }
        topics.append(item)
        
        cat = d.category or "Core"
        if cat not in category_map:
            category_map[cat] = []
        category_map[cat].append(item)
        
    avg_score = round(sum(t["assessment_score"] for t in topics) / max(1, len(topics)), 1)
    avg_accuracy = round(sum(t["accuracy_pct"] for t in topics) / max(1, len(topics)), 1)
    total_completed = sum(t["completed_problems"] for t in topics)
    total_problems = sum(t["total_problems"] for t in topics)

    return {
        "department": current_student.department,
        "dept_code": dept_code,
        "is_core_department": False,
        "domain_title": "DSA Topic-Wise Mastery",
        "overall_dsa_score": avg_score,
        "overall_dsa_accuracy": avg_accuracy,
        "total_problems_solved": total_completed,
        "total_curriculum_problems": total_problems,
        "completion_rate_pct": round((total_completed / max(1, total_problems)) * 100.0, 1),
        "topics": topics,
        "by_category": category_map
    }
