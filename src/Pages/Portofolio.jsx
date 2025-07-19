import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
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

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
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
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
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

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "https://cdn-icons-png.flaticon.com/512/121/121152.png", language: "Java" },
  { icon: "vite.svg", language: "Python" },
  { icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEUAAAD////8/PwEBATV1dX5+fmGhobx8fG1tbX19fXQ0NBra2tYWFgICAjX19eMjIwfHx+SkpLn5+c1NTXg4OBjY2M6Ojp6enpwcHDDw8PMzMyampqsrKx4eHigoKA4ODhTU1MhISESEhJJSUkrKytLS0tCQkK+vr5dXV2BpPbmAAAEz0lEQVR4nO3c2XKiQBQG4F5EUOOGuJuEmEyS93/CacBenEhLSgQP838XkyrTU3WOvXdDGAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqIGU+Y+PP5vp+ntRfCJbjah+s+coEbwQTF5eVY5th1SToq7WvTw1Yf7hvWXbkdUly28f8gt2x65U42bARfAjP6GqctR2aLeTY7YY6pxUlvFhtGLjp6hIkPM5G7cd4s3WAdfjC5+YrvcZnqpx2mZst1O9LOJmhAmX9mN21D1zSbsWP0Ie6AwP579KT50xmLUTWj3SQE8NfLA0s35OsuGpnX61F9+NJNvYUTP+WVNL3Ts/WwiuHn09YKrZ/cICZqwnkKiN4OowtTU4vFgg0ZXYcGB16ZuZvSRBttUlNs1GVhPdB0uaaOagv4GI4uLtW4+hapApKzM3C4EmI6vJSphBJvgoq6FnneGg2eDqMHa2Et+lpUa6SNhgaDUZ2qXovLwU1QzVwuVgmijfekqaDAe0RhqpFis6P+HtYXrC5ElTsdUlsNvd1FfuoEtRW5nudODBlfVYoueTfkOR1WRtRlEReo/T3kxjprR/kuxoBhn/KYy0E36P0kAj7WKT852/bFjli3g8TzZB/uEtudfFStblD0k1tth0Qv7iKTlmK1Nu1Vh8t5NqmKk2FaqvQpyOv9eUeqGaCm0bnZcOpNlxzemMX/A9reuLvU3Qs9aUZvMr1PdAKb9/qtAT+uTUmIMRo3TF5sxwXAS+kknRQPmW0lSfC+1kv/cUOx2DJ0tG7bi7b9soP3rK5QtXkreHiU3Qu1uY7Q99/2rgQaVOFT5dLU3xFt9ZkZYer5E2djYVnsMZsqQ9k+DX1tw0STWLG722o7mLN6cKid9cl3AbKbF5vKKhTTAhtpquyKnCl05m6JwC87SDGUp7uqu2RLT2tFUl9i6G0slSdTNnQeM7gaLLXXXTvJW/Zu5k+Np2MHcR2QQJXllX4SxKyV0GVhPbDK/cVhA1drrh4XpxgtyNRfcni3XbwdyFe4743HYwd+FmWP6EEGX/V4bLTu4s3Ay7P9L47mTocjPs5hnGyMmQ2iNc1SycDLu58p45GXZ09zRwUnxvO5i7cPaHHR1MnT1+R+9lnOlCeO/wyVrY49LfvDQ5ZmwbE9mMxM6pfvyLOX9C5Er87FS/ynMKxX8qXlsgMoGmtplWfctHZjUYBGS2zM5pm6j61O8ke/aLzNmcewdcpWtJtoorFn0U9rlEVTEVjhT7+SvC4u3+kdVDsr3bE/nG81hl9pvZLi8u6DwCLc+eTFTV+F4+ZahfTIu390TaYIi3c7fBIkux1DKbPVWGQdpYcPXo8bNavHSPmDXQP71TZw2JPTol2TE4y/DyW0/vu+KPEAjeI7h+TfnZaMMHxQo165CncWc9+c1w+4DWXLjVyHkQ2cn/e94T9iugspI5J/MX14SbohImw+EwDvUIlH/aeyN7IjfKk/DJciT2wqFLr8W8vmak3rL46fDPeHNef3xH90+ZGJ9JSYK8G/ll7e85dkccwYvhhQ+iFevMQ2/LbWCTzH+EEa13Ra/I6mlk/ohgMPma5q2T9gBz0WyhtB0E3KR7rRIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKCj/gJxECIjADITugAAAABJRU5ErkJggg==", language: "C" },
  { icon: "data:image/png;base64,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", language: "C#" },
  { icon: "data:image/png;base64,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", language: "MySQL" }, 
  { icon: "data:image/png;base64,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", language: "MongoDB" },   
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "reactjs.svg", language: "React JS" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");

      const [projectSnapshot, certificateSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),
      ]);

     const projectData = projectSnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
  // Ensure these fields are explicitly set, providing defaults if they might be missing in Firestore
  TechStack: doc.data().TechStack || [],
  Features: doc.data().Features || [], // Add this line
  Github: doc.data().Github || 'https://github.com/EkiZR', // Add this line, or a sensible default
}));

      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              // Existing styles remain unchanged
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
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
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

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
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

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
        </SwipeableViews>
      </Box>
    </div>
  );
}