import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";

// Toggle Button
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${
          isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"
        }`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Tech stacks
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "https://cdn-icons-png.flaticon.com/512/121/121152.png", language: "Java" },
  { icon: "vite.svg", language: "Python" },
  { icon: "download (1).svg", language: "C" },
  { icon: "csharp.svg", language: "C#" },
  { icon: "mysql.svg", language: "MySQL" },
];

// Main Component
export default function Portofolio() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const initialItems = 6;

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, []);

  // Fetch certificates
  const fetchCertificates = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "certificates"));
    setCertificates(querySnapshot.docs.map((doc) => doc.data()));
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCertificates();
  }, [fetchProjects, fetchCertificates]);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  const toggleShowMore = (type) => {
    if (type === "projects") setShowAllProjects(!showAllProjects);
    else if (type === "certificates") setShowAllCertificates(!showAllCertificates);
  };

  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Tabs Header */}
      <AppBar position="static" color="default" className="rounded-xl bg-white/10 backdrop-blur-md shadow-md">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="portfolio tabs"
        >
          <Tab icon={<Code />} label={`Projects (${projects.length})`} {...a11yProps(0)} />
          <Tab icon={<Award />} label={`Certificates (${certificates.length})`} {...a11yProps(1)} />
          <Tab icon={<Boxes />} label={`Tech Stack (${techStacks.length})`} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* Projects */}
      <TabPanel value={value} index={0} dir={theme.direction}>
        <div className="container mx-auto flex justify-center items-center overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {displayedProjects.map((project, index) => (
              <div
                key={project.id || index}
                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
              >
                <CardProject
                  Img={project.Img}
                  Title={project.Title}
                  Description={project.Description}
                  Link={project.Link}
                  id={project.id}
                />
              </div>
            ))}
          </div>
        </div>
        {projects.length > initialItems && (
          <div className="mt-6 w-full flex justify-start">
            <ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} />
          </div>
        )}
      </TabPanel>

      {/* Certificates */}
      <TabPanel value={value} index={1} dir={theme.direction}>
        <div className="container mx-auto flex justify-center items-center overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
            {displayedCertificates.map((certificate, index) => (
              <div
                key={index}
                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
              >
                <Certificate ImgSertif={certificate.Img} />
              </div>
            ))}
          </div>
        </div>
        {certificates.length > initialItems && (
          <div className="mt-6 w-full flex justify-start">
            <ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} />
          </div>
        )}
      </TabPanel>

      {/* Tech Stacks */}
      <TabPanel value={value} index={2} dir={theme.direction}>
        <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
            {techStacks.map((stack, index) => (
              <div
                key={index}
                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
              >
                <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
              </div>
            ))}
          </div>
        </div>
      </TabPanel>
    </div>
  );
}
