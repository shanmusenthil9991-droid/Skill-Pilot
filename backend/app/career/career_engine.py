from typing import Dict, List, Any
from app.models.entities import Student

# Comprehensive industry domain taxonomy
DEPARTMENT_PATHWAYS = {
    "ECE": {
        "is_dual_track": True,
        "core_pathway": {
            "title": "Core Hardware / ECE Pathway",
            "category": "Core ECE",
            "alignment_score": 86.3,
            "completed_skills": [
                "Microcontroller Architecture (ARM Cortex-M)",
                "Embedded C Hardware Driver Development",
                "UART / SPI / I2C Bus Interfacing",
                "Analog & Digital Electronics Fundamentals",
                "Interrupt Service Routines (ISRs)",
                "IoT Sensor Telemetry Integration"
            ],
            "in_progress_skills": [
                "Verilog RTL Simulation & Synthesis",
                "FreeRTOS Preemptive Task Scheduling & Mutexes",
                "High-Speed PCB Design & Signal Integrity",
                "Static Timing Analysis (STA) in ASIC Flow"
            ],
            "target_roles": ["Firmware Engineer", "Embedded Systems Developer", "VLSI RTL Verification Engineer", "IoT Hardware Architect"]
        },
        "software_pathway": {
            "title": "Software / Computer Science Pathway",
            "category": "Software / CS",
            "alignment_score": 78.5,
            "completed_skills": [
                "Python Scripting & Automation",
                "Object-Oriented Programming (OOP)",
                "Relational Databases & SQL Queries",
                "FastAPI REST API Architecture",
                "Git Version Control & Linux Shell"
            ],
            "in_progress_skills": [
                "Advanced Dynamic Programming & Graphs",
                "Distributed System Design & Microservices",
                "Docker Containerization & CI/CD",
                "Asynchronous Event Pipelines"
            ],
            "target_roles": ["Full Stack Developer", "Backend SDE-1", "Cloud / DevOps Engineer", "Applied AI Developer"]
        },
        "recommendation": "Maintain strategic dual-competency: strengthen RTOS & Verilog hardware design for Core electronics drives while consolidating Dynamic Programming and REST architectures for software recruitment."
    },
    "EEE": {
        "is_dual_track": False,
        "core_pathway": {
            "title": "Electrical Engineering Core Pathway",
            "category": "Core EEE",
            "alignment_score": 88.0,
            "completed_skills": [
                "Kirchhoff Laws & Network Theorems",
                "Transformer Equivalent Circuits & Testing",
                "3-Phase Induction Motor Speed Control",
                "SPICE Circuit Simulation",
                "Power System Load Flow Analysis"
            ],
            "in_progress_skills": [
                "Power Electronics DC-DC Converters & Inverters",
                "PID Controller Tuning & State Space Analysis",
                "Switchgear Protection & Numerical Relays",
                "PLC & SCADA Industrial Automation"
            ],
            "target_roles": ["Power Systems Engineer", "Electrical Design Engineer", "Control Systems Specialist", "EV Powertrain Engineer"]
        },
        "recommendation": "Focus on high-voltage power transmission, industrial motor drives, and renewable grid synchronization."
    },
    "MECH": {
        "is_dual_track": False,
        "core_pathway": {
            "title": "Mechanical Engineering Core Pathway",
            "category": "Core Mechanical",
            "alignment_score": 89.5,
            "completed_skills": [
                "SolidWorks 3D Parametric Modeling",
                "Engineering Mechanics & Statics",
                "Thermodynamic Power Cycles (Rankine/Brayton)",
                "GD&T Tolerancing & Drafting Standards",
                "Machining & CNC G-Code Generation"
            ],
            "in_progress_skills": [
                "Finite Element Stress Analysis (FEA)",
                "Computational Fluid Dynamics (CFD)",
                "Robotic Manipulator Kinematics (6-DOF)",
                "Hydraulics & Pneumatic Control Systems"
            ],
            "target_roles": ["Mechanical Design Engineer", "Thermal Systems Engineer", "Robotics & Automation Specialist", "CAD/CAM Developer"]
        },
        "recommendation": "Advance your CAD surface modeling and FEA simulation competencies for automotive and aerospace mechanical engineering roles."
    },
    "CIVIL": {
        "is_dual_track": False,
        "core_pathway": {
            "title": "Civil Engineering Core Pathway",
            "category": "Core Civil",
            "alignment_score": 87.5,
            "completed_skills": [
                "RCC Slab & Beam Design (IS 456)",
                "Total Station & Drone Surveying",
                "AutoCAD 2D Architectural Drafting",
                "Fluid Mechanics & Open Channel Flow",
                "Quantity Surveying & BOQ Estimation"
            ],
            "in_progress_skills": [
                "STAAD.Pro Structural Frame Analysis",
                "Revit BIM 3D Structural Modeling",
                "Soil Shear Strength & Triaxial Testing",
                "CPM / PERT Project Scheduling"
            ],
            "target_roles": ["Structural Engineer", "BIM Coordinator", "Geotechnical Engineer", "Construction Project Manager"]
        },
        "recommendation": "Deepen structural modeling in STAAD.Pro and BIM clash detection in Revit to excel in infrastructure consulting."
    },
    "CSE": {
        "is_dual_track": False,
        "core_pathway": {
            "title": "Full Stack & Distributed Systems Pathway",
            "category": "Software / CS",
            "alignment_score": 92.5,
            "completed_skills": [
                "Data Structures & Core Algorithms",
                "Full Stack Web Development (React & TypeScript)",
                "Backend Architecture (FastAPI / Java)",
                "Relational Database Design & PostgreSQL",
                "Git & Automated CI/CD Pipelines"
            ],
            "in_progress_skills": [
                "Distributed System Design (Sharding & Caching)",
                "Advanced Graph & Dynamic Programming Problems",
                "Kubernetes Orchestration & Microservices",
                "Asynchronous Message Queues (Kafka / Redis)"
            ],
            "target_roles": ["Full Stack Engineer", "Backend SDE-1", "Cloud & DevOps Architect", "Systems Software Engineer"]
        },
        "recommendation": "Focus on high-throughput backend architecture and competitive LeetCode contest problem speed for tier-1 product recruitment."
    }
}

DEPARTMENT_ALL_DOMAINS = {
    "ECE": [
        {
            "domain_name": "Embedded Systems & Firmware Engineering",
            "category": "Core ECE",
            "alignment_score": 88.5,
            "completed_skills": [
                "Embedded C",
                "ARM Cortex-M Architecture",
                "UART / SPI / I2C Bus Protocols",
                "FreeRTOS Task Scheduling & Mutexes"
            ],
            "in_progress_skills": [
                "Bare-metal DMA Optimization",
                "CAN / LIN Automotive Bus Protocols",
                "Secure Boot & Hardware Cryptography"
            ],
            "recommended_roles": ["Firmware Engineer", "Embedded Systems Developer", "Hardware Integration Engineer"]
        },
        {
            "domain_name": "VLSI Architecture & Chip Design",
            "category": "Core ECE",
            "alignment_score": 84.0,
            "completed_skills": [
                "Verilog HDL RTL Design",
                "Digital Logic & State Machine Design",
                "CMOS Inverter Characteristics",
                "Combinational & Sequential Logic"
            ],
            "in_progress_skills": [
                "SystemVerilog UVM Verification",
                "Static Timing Analysis (STA)",
                "ASIC Physical Design Flow"
            ],
            "recommended_roles": ["VLSI Design Engineer", "ASIC Verification Specialist", "RTL Synthesis Engineer"]
        },
        {
            "domain_name": "IoT & Connected Edge Devices",
            "category": "Core ECE",
            "alignment_score": 86.0,
            "completed_skills": [
                "ESP32 & STM32 Microcontrollers",
                "MQTT / HTTP Telemetry Protocols",
                "ADC / DAC Sensor Interfacing",
                "Actuator Relays & PWM Drivers"
            ],
            "in_progress_skills": [
                "BLE Mesh Networking",
                "Edge AI / TinyML on Microcontrollers",
                "Low-Power Duty Cycling"
            ],
            "recommended_roles": ["IoT Solutions Architect", "Hardware Systems Engineer", "Connected Devices Developer"]
        },
        {
            "domain_name": "Full Stack Software Engineering",
            "category": "Software / CS",
            "alignment_score": 78.5,
            "completed_skills": [
                "Python Core & FastAPI",
                "RESTful API Architecture",
                "Relational Databases & SQL Queries",
                "Git Version Control"
            ],
            "in_progress_skills": [
                "Advanced Graph & Dynamic Programming",
                "Distributed Microservices Architecture",
                "Docker Containerization & CI/CD"
            ],
            "recommended_roles": ["Full Stack Software Engineer", "Backend Systems SDE-1", "Software Engineer - Applications"]
        },
        {
            "domain_name": "Cloud Infrastructure & DevOps",
            "category": "Software / CS",
            "alignment_score": 74.0,
            "completed_skills": [
                "Linux Shell Scripting & Bash",
                "Docker Container Basics",
                "PostgreSQL Database Administration",
                "REST API Monitoring & Logging"
            ],
            "in_progress_skills": [
                "Kubernetes Container Orchestration",
                "AWS Cloud Architecture",
                "Terraform Infrastructure as Code"
            ],
            "recommended_roles": ["Cloud Infrastructure Associate", "DevOps Engineer", "Site Reliability Engineer (SRE)"]
        },
        {
            "domain_name": "Applied AI & Machine Learning Systems",
            "category": "Software / CS",
            "alignment_score": 76.5,
            "completed_skills": [
                "Python NumPy & Pandas Stack",
                "Supervised Learning Algorithms",
                "Data Preprocessing Pipelines",
                "Model Validation Metrics"
            ],
            "in_progress_skills": [
                "Deep Learning with PyTorch",
                "Computer Vision with OpenCV",
                "Transformer NLP Inference"
            ],
            "recommended_roles": ["AI Solutions Engineer", "Machine Learning Specialist", "Data Engineer"]
        }
    ],
    "EEE": [
        {
            "domain_name": "Power Systems & Grid Engineering",
            "category": "Core EEE",
            "alignment_score": 89.0,
            "completed_skills": [
                "Power System Load Flow Analysis",
                "Transmission Line Parameter Modeling",
                "Transformer Equivalent Circuits & Testing",
                "Fault Calculation & Symmetrical Components"
            ],
            "in_progress_skills": [
                "Smart Grid SCADA Integration",
                "Renewable Energy Grid Synchronization",
                "Numerical Relay & Protection Coordination"
            ],
            "recommended_roles": ["Power Systems Engineer", "Grid Operations Specialist", "Substation Design Engineer"]
        },
        {
            "domain_name": "Control Systems & Industrial Automation",
            "category": "Core EEE",
            "alignment_score": 86.5,
            "completed_skills": [
                "PID Controller Tuning",
                "State-Space Representation",
                "Frequency Response & Bode Plot Analysis",
                "Root Locus Stability Criteria"
            ],
            "in_progress_skills": [
                "PLC Ladder Logic Programming",
                "Industrial DCS & SCADA Systems",
                "Model Predictive Control (MPC)"
            ],
            "recommended_roles": ["Control Systems Engineer", "Industrial Automation Engineer", "Instrumentation Specialist"]
        },
        {
            "domain_name": "Power Electronics & EV Powertrain",
            "category": "Core EEE",
            "alignment_score": 87.0,
            "completed_skills": [
                "DC-DC Buck & Boost Converters",
                "IGBT / MOSFET Gate Drivers",
                "Single-Phase & 3-Phase Inverters",
                "PWM Switching Techniques"
            ],
            "in_progress_skills": [
                "EV Traction Inverter Design",
                "Battery Management Systems (BMS)",
                "Wireless Power Transfer Technologies"
            ],
            "recommended_roles": ["Power Electronics Engineer", "EV Powertrain Specialist", "Hardware Power Architect"]
        },
        {
            "domain_name": "Electrical Machines & Drives",
            "category": "Core EEE",
            "alignment_score": 85.5,
            "completed_skills": [
                "3-Phase Induction Motor Speed Control",
                "Synchronous Machine Characteristics",
                "DC Motor Torque Control & Braking",
                "Magnetic Circuit Analysis"
            ],
            "in_progress_skills": [
                "Field-Oriented Control (FOC)",
                "BLDC Motor Sensorless Drives",
                "Finite Element Motor Design (FEM)"
            ],
            "recommended_roles": ["Electrical Drives Engineer", "Machine Design Specialist", "Electromechanical Engineer"]
        }
    ],
    "MECH": [
        {
            "domain_name": "Mechanical CAD/CAM & Parametric Design",
            "category": "Core Mechanical",
            "alignment_score": 91.0,
            "completed_skills": [
                "SolidWorks 3D Parametric Modeling",
                "GD&T Tolerancing & Drafting Standards",
                "Assembly Mates & Kinematic Simulation",
                "Sheet Metal & Weldment Design"
            ],
            "in_progress_skills": [
                "CATIA Surface Modeling",
                "Generative Design & Topology Optimization",
                "Additive Manufacturing DfAM Guidelines"
            ],
            "recommended_roles": ["Mechanical Design Engineer", "CAD/CAM Specialist", "Product Development Engineer"]
        },
        {
            "domain_name": "Thermal, Fluid & Energy Systems",
            "category": "Core Mechanical",
            "alignment_score": 86.0,
            "completed_skills": [
                "Thermodynamic Power Cycles (Rankine/Brayton)",
                "Heat Exchanger Thermal Sizing (LMTD/NTU)",
                "Navier-Stokes Equations & Incompressible Flow",
                "Psychrometric Chart Analysis"
            ],
            "in_progress_skills": [
                "ANSYS Fluent CFD Aerodynamics",
                "Thermal Management for Electronics",
                "Turbomachinery Blade Aerodynamics"
            ],
            "recommended_roles": ["Thermal Systems Engineer", "CFD Analysis Engineer", "HVAC Design Specialist"]
        },
        {
            "domain_name": "Robotics & Mechatronics Automation",
            "category": "Core Mechanical",
            "alignment_score": 88.5,
            "completed_skills": [
                "Forward & Inverse Kinematics (DH Parameters)",
                "Hydraulic & Pneumatic Actuator Circuits",
                "Sensor-Actuator Interfacing (Encoders/Servos)",
                "Robotic Gripper Design"
            ],
            "in_progress_skills": [
                "ROS (Robot Operating System) Navigation",
                "Dynamic Trajectory Planning",
                "Computer Vision for Robotic Pick-and-Place"
            ],
            "recommended_roles": ["Robotics Engineer", "Mechatronics Specialist", "Automation Systems Developer"]
        },
        {
            "domain_name": "Manufacturing & CNC Production",
            "category": "Core Mechanical",
            "alignment_score": 87.0,
            "completed_skills": [
                "CNC G-Code & M-Code Programming",
                "Machining Mechanics (Orthogonal Cutting)",
                "Casting, Forging & Metal Forming",
                "Quality Control & Metrology (CMM)"
            ],
            "in_progress_skills": [
                "Multi-Axis 5-Axis CNC Milling",
                "Lean Six Sigma Process Optimization",
                "Digital Twin for Factory Production"
            ],
            "recommended_roles": ["Manufacturing Engineer", "Production Planning Engineer", "Tooling & Fixture Specialist"]
        }
    ],
    "CIVIL": [
        {
            "domain_name": "Structural Analysis & Design",
            "category": "Core Civil",
            "alignment_score": 89.0,
            "completed_skills": [
                "RCC Slab, Beam & Column Design (IS 456)",
                "Bending Moment & Shear Force Modeling",
                "Structural Steel Connections & Trusses",
                "Limit State Design Principles"
            ],
            "in_progress_skills": [
                "STAAD.Pro High-Rise Frame Analysis",
                "ETABS Earthquake Resistant Design",
                "Prestressed Concrete Design"
            ],
            "recommended_roles": ["Structural Engineer", "Civil Design Engineer", "Bridge Engineering Associate"]
        },
        {
            "domain_name": "BIM & Construction Project Management",
            "category": "Core Civil",
            "alignment_score": 86.5,
            "completed_skills": [
                "AutoCAD 2D Architectural Drafting",
                "Quantity Surveying & BOQ Estimation",
                "Bar Bending Schedule (BBS) Calculations",
                "Site Safety & Quality Management"
            ],
            "in_progress_skills": [
                "Revit BIM 3D Structural Modeling",
                "Navisworks 4D Construction Simulation",
                "Primavera P6 / MS Project Scheduling"
            ],
            "recommended_roles": ["BIM Coordinator", "Construction Project Manager", "Planning & Cost Estimation Engineer"]
        },
        {
            "domain_name": "Geotechnical & Foundation Engineering",
            "category": "Core Civil",
            "alignment_score": 85.0,
            "completed_skills": [
                "Soil Classification & Atterberg Limits",
                "Compaction & Permeability Testing",
                "Direct Shear & Triaxial Testing",
                "Shallow Footing Bearing Capacity"
            ],
            "in_progress_skills": [
                "Deep Pile Foundation Design",
                "Slope Stability & Retaining Wall Design (PLAXIS)",
                "Soil Improvement & Ground Anchors"
            ],
            "recommended_roles": ["Geotechnical Engineer", "Foundation Specialist", "Site Investigation Engineer"]
        },
        {
            "domain_name": "Surveying, GIS & Transportation",
            "category": "Core Civil",
            "alignment_score": 87.5,
            "completed_skills": [
                "Total Station & Theodolite Surveying",
                "Contour Mapping & Levelling",
                "Highway Geometric Alignment Design",
                "Flexible & Rigid Pavement Layer Design"
            ],
            "in_progress_skills": [
                "Drone Photogrammetry & LiDAR Processing",
                "ArcGIS Spatial Infrastructure Mapping",
                "Traffic Flow Simulation (VISSIM)"
            ],
            "recommended_roles": ["Transportation Planning Engineer", "Survey & GIS Specialist", "Highway Design Engineer"]
        }
    ],
    "CSE": [
        {
            "domain_name": "Full Stack Web & Distributed Systems",
            "category": "Software / CS",
            "alignment_score": 93.0,
            "completed_skills": [
                "React & TypeScript Architecture",
                "FastAPI / Node.js Backend Services",
                "Relational Database Design & PostgreSQL",
                "Git & Automated CI/CD Pipelines"
            ],
            "in_progress_skills": [
                "Distributed Caching (Redis) & Message Brokers (Kafka)",
                "Database Sharding & Read Replicas",
                "GraphQL APIs & WebSocket Streaming"
            ],
            "recommended_roles": ["Full Stack Engineer", "Web Applications Architect", "Frontend Engineering Specialist"]
        },
        {
            "domain_name": "Backend Engineering & High-Throughput APIs",
            "category": "Software / CS",
            "alignment_score": 91.5,
            "completed_skills": [
                "Data Structures & Core Algorithms",
                "RESTful API Contract Design",
                "JWT Authentication & RBAC Security",
                "Concurrency & Asynchronous I/O"
            ],
            "in_progress_skills": [
                "Distributed System Design (CAP / Consensus)",
                "gRPC & Microservices Communication",
                "Elasticsearch Query Optimization"
            ],
            "recommended_roles": ["Backend SDE-1", "Systems Software Engineer", "API Platform Developer"]
        },
        {
            "domain_name": "Cloud Architecture & DevOps Systems",
            "category": "Software / CS",
            "alignment_score": 86.0,
            "completed_skills": [
                "Linux Shell Scripting & CLI",
                "Docker Multi-stage Image Builds",
                "Nginx Reverse Proxy & SSL Configuration",
                "GitHub Actions Automated Workflows"
            ],
            "in_progress_skills": [
                "Kubernetes Cluster Deployment & Ingress",
                "AWS Cloud Services (ECS, S3, RDS, Lambda)",
                "Terraform Infrastructure as Code (IaC)"
            ],
            "recommended_roles": ["DevOps Engineer", "Cloud Infrastructure Architect", "Site Reliability Engineer (SRE)"]
        },
        {
            "domain_name": "Artificial Intelligence & Deep Learning",
            "category": "Software / CS",
            "alignment_score": 89.0,
            "completed_skills": [
                "Python Scientific Stack (NumPy / Pandas / Scikit-Learn)",
                "Ensemble Machine Learning Models",
                "Data Pipeline Feature Engineering",
                "Model Performance Evaluation Metrics"
            ],
            "in_progress_skills": [
                "PyTorch Neural Networks & Backpropagation",
                "Convolutional Vision Networks (CNNs)",
                "Transformer Large Language Model Fine-tuning"
            ],
            "recommended_roles": ["Machine Learning Engineer", "AI Research Associate", "Data Science Developer"]
        },
        {
            "domain_name": "Data Engineering & Analytics Pipelines",
            "category": "Software / CS",
            "alignment_score": 84.5,
            "completed_skills": [
                "SQL Complex Window Functions & Joins",
                "ETL Data Ingestion Pipelines",
                "Data Cleaning & Normalization",
                "Pandas Vectorized Processing"
            ],
            "in_progress_skills": [
                "Apache Spark Distributed Dataframes",
                "Apache Airflow DAG Scheduling",
                "Snowflake / BigQuery Cloud Data Warehousing"
            ],
            "recommended_roles": ["Data Engineer", "Analytics Platform Developer", "BI Engineering Specialist"]
        }
    ]
}

class CareerEngine:
    def calculate_student_career_alignment(self, student: Student) -> Dict[str, Any]:
        dept_code = student.dept_code.upper() if student.dept_code else "CSE"
        if dept_code in ["IT", "AIML", "AIDS"]:
            dept_key = "CSE"
        elif dept_code in DEPARTMENT_PATHWAYS:
            dept_key = dept_code
        else:
            dept_key = "CSE"
            
        pathway_info = DEPARTMENT_PATHWAYS[dept_key]
        all_domains_for_dept = DEPARTMENT_ALL_DOMAINS.get(dept_key, DEPARTMENT_ALL_DOMAINS["CSE"])
        is_ece = dept_code == "ECE"
        
        # Build ECE Dual Track Response
        ece_dual_track = {
            "department": student.department,
            "is_ece": is_ece,
            "core_ece_alignment_pct": 86.3 if is_ece else 0.0,
            "software_cs_alignment_pct": 78.5 if is_ece else 0.0,
            "core_pathway": pathway_info["core_pathway"],
            "software_pathway": pathway_info.get("software_pathway"),
            "primary_recommendation": pathway_info["recommendation"]
        }
        
        return {
            "department": student.department,
            "dept_code": dept_code,
            "is_ece": is_ece,
            "pathway_info": pathway_info,
            "ece_dual_track": ece_dual_track,
            "all_domains": all_domains_for_dept
        }

career_engine = CareerEngine()
