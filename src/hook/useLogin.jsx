import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request";
import { showAlert } from "../utils/alert";

const useLogin = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [forgotData, setForgotData] = useState({
		email: "",
		otp: "",
		newPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isForgotMode, setIsForgotMode] = useState(false);
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [isOtpVerified, setIsOtpVerified] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/dashboard");
		}
	}, [navigate]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleForgotChange = (event) => {
		const { name, value } = event.target;
		setForgotData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const resetForgotState = () => {
		setForgotData({
			email: "",
			otp: "",
			newPassword: "",
		});
		setIsOtpSent(false);
		setIsOtpVerified(false);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.email || !formData.password) {
			showAlert("warning", "Email and password are required");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await request("api/user/login", "POST", formData);
			if (response?.success && response?.token) {
				localStorage.setItem("token", response.token);
				showAlert("success", response.message || "Login successful");
				navigate("/dashboard");
				return;
			}

			showAlert("error", response?.message || "Login failed");
		} catch (error) {
			const message =
				error?.response?.data?.message || "Cannot login. Please try again.";
			showAlert("error", message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSendOtp = async () => {
		if (!forgotData.email) {
			showAlert("warning", "Email is required");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await request("api/user/sendOTP", "POST", {
				email: forgotData.email,
			});

			if (response?.success) {
				setIsOtpSent(true);
				setIsOtpVerified(false);
				showAlert("success", response?.message || "OTP sent successfully");
				return;
			}

			showAlert("error", response?.message || "Failed to send OTP");
		} catch (error) {
			const message =
				error?.response?.data?.message || "Cannot send OTP. Please try again.";
			showAlert("error", message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyOtp = async () => {
		if (!forgotData.email || !forgotData.otp) {
			showAlert("warning", "Email and OTP are required");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await request("api/user/verifyOTP", "POST", {
				email: forgotData.email,
				otp: forgotData.otp,
			});

			if (response?.success) {
				setIsOtpVerified(true);
				showAlert("success", response?.message || "OTP verified successfully");
				return;
			}

			showAlert("error", response?.message || "OTP verification failed");
		} catch (error) {
			const message =
				error?.response?.data?.message || "Cannot verify OTP. Please try again.";
			showAlert("error", message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResetPassword = async () => {
		if (!forgotData.email || !forgotData.newPassword) {
			showAlert("warning", "Email and new password are required");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await request("api/user/resetPassword", "POST", {
				email: forgotData.email,
				newPassword: forgotData.newPassword,
			});

			if (response?.success) {
				showAlert("success", response?.message || "Password reset successfully");
				setIsForgotMode(false);
				resetForgotState();
				return;
			}

			showAlert("error", response?.message || "Reset password failed");
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Cannot reset password. Please try again.";
			showAlert("error", message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const openForgotMode = () => {
		setIsForgotMode(true);
		setForgotData((prev) => ({
			...prev,
			email: formData.email || prev.email,
		}));
	};

	const backToLogin = () => {
		setIsForgotMode(false);
		resetForgotState();
	};

	return {
		formData,
		forgotData,
		isSubmitting,
		isForgotMode,
		isOtpSent,
		isOtpVerified,
		handleChange,
		handleForgotChange,
		handleSubmit,
		handleSendOtp,
		handleVerifyOtp,
		handleResetPassword,
		openForgotMode,
		backToLogin,
	};
};

export default useLogin;
