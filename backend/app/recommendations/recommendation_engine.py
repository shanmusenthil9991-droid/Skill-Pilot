from typing import List, Dict, Any
from app.models.entities import Student

class RecommendationEngine:
    def generate_recommendations(self, student: Student) -> List[Dict[str, Any]]:
        recommendations = []
        dept_code = student.dept_code.upper() if student.dept_code else "CSE"
        is_ece = dept_code == "ECE"
        is_eee = dept_code == "EEE"
        is_mech = dept_code == "MECH"
        is_civil = dept_code == "CIVIL"
        is_cse_cluster = dept_code in ["CSE", "IT", "AIML", "AIDS"]
        
        # 1. Domain Technical Recommendations (Zero CSE leakage for EEE, Mech, Civil!)
        if is_ece:
            recommendations.append({
                "id": 1,
                "category": "Core Hardware / ECE",
                "title": "Strengthen Verilog RTL Modeling & FPGA Prototyping",
                "what": "Complete hands-on FPGA RTL modeling in Verilog and timing simulation testbenches.",
                "why": "Core semiconductor and embedded systems companies prioritize RTL synthesis, STA, and low-level hardware registers.",
                "next_step": "Build a hardware SPI master controller on FPGA and simulate testbenches in ModelSim / Vivado.",
                "priority": "High",
                "is_completed": False
            })
            recommendations.append({
                "id": 2,
                "category": "Dual-Pathway / Software CS",
                "title": "Consolidate Dynamic Programming & REST API Architecture",
                "what": "Master 2D dynamic programming optimization and asynchronous REST endpoints.",
                "why": "Software recruiters look for robust data structures alongside core engineering problem-solving in ECE candidates.",
                "next_step": "Practice 10 medium-level dynamic programming problems and build a FastAPI backend service.",
                "priority": "Medium",
                "is_completed": False
            })
        elif is_eee:
            recommendations.append({
                "id": 1,
                "category": "Power Systems & Drives",
                "title": "Simulate Inverter Topologies & Motor Control Schemes",
                "what": "Design and simulate sinusoidal PWM gate driver circuits for BLDC and induction motor drives in MATLAB / SPICE.",
                "why": "EV powertrain and industrial drive manufacturers evaluate power electronics conversion efficiency and switching dynamics.",
                "next_step": "Simulate a 3-phase voltage source inverter with closed-loop PID current control in MATLAB Simulink.",
                "priority": "High",
                "is_completed": False
            })
            recommendations.append({
                "id": 2,
                "category": "Grid Protection",
                "title": "Master Numerical Relay Coordination & Fault Analysis",
                "what": "Perform symmetrical and unsymmetrical fault calculations for industrial substation buses.",
                "why": "Power grid utilities and energy consultants require thorough knowledge of distance and differential protection schemes.",
                "next_step": "Complete an ETAP load flow and short-circuit fault study on a standard 9-bus electrical network.",
                "priority": "Medium",
                "is_completed": False
            })
        elif is_mech:
            recommendations.append({
                "id": 1,
                "category": "CAD / FEA Simulation",
                "title": "Perform Structural Finite Element Analysis (FEA) in ANSYS",
                "what": "Execute static structural and thermal stress simulations on complex machine components.",
                "why": "Automotive and aerospace mechanical design roles test stress concentration, Von Mises yield criteria, and meshing convergence.",
                "next_step": "Model a connecting rod assembly in SolidWorks and perform convergence stress analysis in ANSYS.",
                "priority": "High",
                "is_completed": False
            })
            recommendations.append({
                "id": 2,
                "category": "Robotics & Automation",
                "title": "Implement 6-DOF Industrial Robotic Kinematics",
                "what": "Formulate Denavit-Hartenberg (D-H) parameter matrices for serial robotic arms and trajectory planning.",
                "why": "Manufacturing automation and robotics companies screen heavily on spatial transformations and actuator selection.",
                "next_step": "Simulate robotic manipulator pick-and-place trajectories using MATLAB Robotics Toolbox.",
                "priority": "Medium",
                "is_completed": False
            })
        elif is_civil:
            recommendations.append({
                "id": 1,
                "category": "Structural Modeling",
                "title": "Model Multi-Story Seismic Frames in STAAD.Pro / ETABS",
                "what": "Perform response spectrum dynamic seismic analysis and limit state RCC detailing per IS 1893 and IS 456.",
                "why": "Infrastructure consulting and structural engineering firms mandate proficiency in 3D frame analysis and wind/earthquake loading.",
                "next_step": "Design a G+5 commercial concrete frame structure with shear wall detailing in STAAD.Pro.",
                "priority": "High",
                "is_completed": False
            })
            recommendations.append({
                "id": 2,
                "category": "BIM & Project Planning",
                "title": "Execute 3D Rebar Detailing & Clash Detection in Revit",
                "what": "Construct building information models (BIM) with integrated MEP clash detection in Navisworks.",
                "why": "Modern mega-infrastructure projects mandate digital BIM coordination and parametric scheduling.",
                "next_step": "Generate a detailed 3D foundation reinforcement model in Autodesk Revit with quantity takeoff schedules.",
                "priority": "Medium",
                "is_completed": False
            })
        else: # CSE Cluster (CSE, IT, AIML, AIDS)
            recommendations.append({
                "id": 1,
                "category": "DSA Mastery",
                "title": "Master Graph Algorithms & Dynamic Programming",
                "what": "Strengthen non-linear data structures including Dijkstra, Topological Sort, and 2D Memoization.",
                "why": "Graph and DP algorithms account for over 40% of tier-1 product technical elimination rounds.",
                "next_step": "Solve 5 medium-difficulty Graph BFS/DFS problems sequentially on LeetCode without boilerplate shortcuts.",
                "priority": "High",
                "is_completed": False
            })
            recommendations.append({
                "id": 2,
                "category": "Full Stack & Cloud",
                "title": "Containerize Distributed Microservices with Docker & CI/CD",
                "what": "Package backend services and frontend applications into Docker containers with automated GitHub Actions.",
                "why": "Production readiness and cloud architecture significantly increase interview shortlisting rates.",
                "next_step": "Create a multi-stage Dockerfile and docker-compose configuration for your top project.",
                "priority": "Medium",
                "is_completed": False
            })

        # 2. Aptitude & Cognitive
        if student.aptitude_progress:
            weak_apt = [a for a in student.aptitude_progress if a.accuracy_pct < 70.0]
            if weak_apt:
                target_apt = weak_apt[0]
                recommendations.append({
                    "id": 3,
                    "category": "Quantitative Aptitude",
                    "title": f"Practice {target_apt.topic_name} Shortcut Formulations",
                    "what": f"Revise mathematical short-tricks and timed problem-solving for {target_apt.topic_name}.",
                    "why": f"Your accuracy in {target_apt.topic_name} is currently {target_apt.accuracy_pct:.1f}%. High scores in initial round aptitude tests are mandatory for tier-1 campus recruitment.",
                    "next_step": f"Complete a 20-question timed speed test on {target_apt.topic_name} under 15 minutes.",
                    "priority": "Medium",
                    "is_completed": False
                })

        # 3. Communication & Soft Skills
        recommendations.append({
            "id": 4,
            "category": "Interview Communication",
            "title": "Structure Technical Answers Using the STAR Method",
            "what": "Practice Situation, Task, Action, and Result framing during technical and behavioral project walkthroughs.",
            "why": "Clear technical articulation prevents rambling and demonstrates leadership maturity in final rounds.",
            "next_step": "Conduct 2 recorded mock project presentation drills focusing on concise 2-minute architectural summaries.",
            "priority": "Medium",
            "is_completed": False
        })
        
        return recommendations

recommendation_engine = RecommendationEngine()
