import React from "react";
import useLogin from "../../../hook/useLogin";
import "./login.css";

const Login = () => {
	const {
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
	} = useLogin();

	return (
		<div className="login-page">
			<div className="login-bg-orb login-bg-orb-one" />
			<div className="login-bg-orb login-bg-orb-two" />
			<div className="login-card">
				{!isForgotMode ? (
					<>
						<p className="login-badge">Welcome back</p>
						<h2 className="login-title">Sign in to your account</h2>
						<p className="login-subtitle">Use your email and password to continue.</p>
						<form onSubmit={handleSubmit} className="login-form">
							<div className="login-field">
								<label htmlFor="email">Email</label>
								<input
									id="email"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Enter your email"
									className="login-input"
								/>
							</div>

							<div className="login-field">
								<label htmlFor="password">Password</label>
								<input
									id="password"
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
									className="login-input"
								/>
							</div>

							<div className="login-actions">
								<button type="submit" disabled={isSubmitting} className="login-button">
									{isSubmitting ? "Signing in..." : "Login"}
								</button>
								<button
									type="button"
									onClick={openForgotMode}
									disabled={isSubmitting}
									className="login-link-button"
								>
									Forgot password?
								</button>
							</div>
						</form>
					</>
				) : (
					//click on forgot password
					<>
						<p className="login-badge">Account recovery</p>
						<h2 className="login-title">Forgot password</h2>
						<p className="login-subtitle">
							Send OTP to email, verify it, then set your new password.
						</p>
						<div className="login-form">
							<div className="login-field">
								<label htmlFor="forgot-email">Email</label>
								<input
									id="forgot-email"
									type="email"
									name="email"
									value={forgotData.email}
									onChange={handleForgotChange}
									placeholder="Enter your email"
									className="login-input"
								/>
							</div>

							<button
								type="button"
								onClick={handleSendOtp}
								disabled={isSubmitting}
								className="login-button"
							>
								{isSubmitting ? "Sending..." : "Send OTP"}
							</button>


							{/* handle OTPsend and verify logic */}
							{isOtpSent && (
								<>
									<div className="login-field">
										<label htmlFor="otp">OTP</label>
										<input
											id="otp"
											type="text"
											name="otp"
											value={forgotData.otp}
											onChange={handleForgotChange}
											placeholder="Enter OTP"
											className="login-input"
										/>
									</div>

									<button
										type="button"
										onClick={handleVerifyOtp}
										disabled={isSubmitting || isOtpVerified}
										className="login-button"
									>
										{isSubmitting ? "Verifying..." : isOtpVerified ? "OTP Verified" : "Verify OTP"}
									</button>
								</>
							)}

							{isOtpVerified && (
								<>
									<div className="login-field">
										<label htmlFor="newPassword">New Password</label>
										<input
											id="newPassword"
											type="password"
											name="newPassword"
											value={forgotData.newPassword}
											onChange={handleForgotChange}
											placeholder="Enter new password"
											className="login-input"
										/>
									</div>

									<button
										type="button"
										onClick={handleResetPassword}
										disabled={isSubmitting}
										className="login-button"
									>
										{isSubmitting ? "Resetting..." : "Reset Password"}
									</button>
								</>
							)}

							<button
								type="button"
								onClick={backToLogin}
								disabled={isSubmitting}
								className="login-link-button"
							>
								Back to login
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Login;
