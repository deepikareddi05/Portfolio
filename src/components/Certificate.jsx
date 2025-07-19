import React, { useState } from "react"
import {
	Modal,
	IconButton,
	Box,
	Backdrop,
	Zoom,
	Typography,
	Button,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"

const Certificate = ({ ImgSertif, title, description }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	return (
		<Box sx={{ width: "100%" }}>
			{/* Certificate Card */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					cursor: "pointer",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
						"& .certificate-image": {
							filter: "contrast(1.05) brightness(1) saturate(1.1)",
						},
					},
				}}>
				<Box sx={{ position: "relative" }}>
					<img
						src={ImgSertif}
						alt="Certificate"
						className="certificate-image"
						style={{
							width: "100%",
							height: "auto",
							display: "block",
							objectFit: "cover",
							filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
							transition: "filter 0.3s ease",
						}}
						onClick={handleOpen}
					/>

					{/* Hover Overlay */}
					<Box
						className="overlay"
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0,
							backgroundColor: "rgba(0,0,0,0.4)",
							transition: "opacity 0.3s ease",
							zIndex: 2,
						}}
						onClick={handleOpen}>
						<Box
							className="hover-content"
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -60%)",
								opacity: 0,
								transition: "all 0.4s ease",
								textAlign: "center",
								color: "white",
							}}>
							<FullscreenIcon sx={{ fontSize: 40, mb: 1 }} />
							<Typography variant="h6">View Certificate</Typography>
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Modal with Zoom Animation */}
			<Modal
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}>
				<Zoom in={open}>
					<Box
						sx={{
							position: "relative",
							margin: "auto",
							maxWidth: "90vw",
							maxHeight: "90vh",
							outline: "none",
							bgcolor: "transparent",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							p: 2,
						}}>
						{/* Close Button */}
						<IconButton
							onClick={handleClose}
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
								color: "#fff",
								bgcolor: "rgba(0,0,0,0.6)",
								"&:hover": {
									bgcolor: "rgba(0,0,0,0.8)",
								},
							}}>
							<CloseIcon />
						</IconButton>

						{/* Full Image */}
						<img
							src={ImgSertif}
							alt="Certificate Full View"
							style={{
								maxWidth: "100%",
								maxHeight: "70vh",
								borderRadius: 8,
								boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
							}}
						/>

						{/* Title and Description */}
						<Typography
							variant="h6"
							sx={{ color: "#fff", mt: 3, fontWeight: 600, textAlign: "center" }}>
							{title}
						</Typography>
						<Typography
							variant="body2"
							sx={{ color: "#ccc", mt: 1, textAlign: "center", maxWidth: "80%" }}>
							{description}
						</Typography>

						{/* Download Button */}
						<a
							href={ImgSertif}
							download
							target="_blank"
							rel="noopener noreferrer"
							style={{ marginTop: "16px", textDecoration: "none" }}>
							<Button variant="contained" sx={{ mt: 2 }}>
								Download Certificate
							</Button>
						</a>
					</Box>
				</Zoom>
			</Modal>
		</Box>
	)
}

export default Certificate
