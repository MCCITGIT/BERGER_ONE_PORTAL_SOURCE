import { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';
import { ChangeUserPassword, PasswordValidateOTP, UserValidationForPassword } from '../../services/login/loginSevice';

type ForgotPasswordStep = 'validate' | 'otp' | 'changePassword';

type ForgotPasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const inputClass =
    'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
    const [step, setStep] = useState<ForgotPasswordStep>('validate');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('validate');
            setLoading(false);
            setUserId('');
            setMobileNo('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetAndClose = () => {
        setStep('validate');
        setLoading(false);
        setUserId('');
        setMobileNo('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    const handleValidateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId.trim() || !mobileNo.trim()) {
            commonErrorToast('Please enter User ID and Mobile No.');
            return;
        }
        setLoading(true);
        try {
            const response: any = await UserValidationForPassword({ userId: userId.trim(), mobileNo: mobileNo.trim() });
            if (response?.statusCode === 200 && response?.message === 'OTP sent successfully.') {
                commonSuccessToast(response.message);
                setOtp('');
                setStep('otp');
            } else {
                commonErrorToast(response?.message || 'Unable to send OTP');
            }
        } catch (error) {
            commonErrorToast('Unable to send OTP - ' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidateOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) {
            commonErrorToast('Please enter OTP');
            return;
        }
        setLoading(true);
        try {
            const response: any = await PasswordValidateOTP({ userId: userId.trim(), mobileNo: mobileNo.trim(), otp: otp.trim() });
            if (response?.statusCode === 200 && response?.message === 'OTP verified successfully.') {
                commonSuccessToast(response.message);
                setNewPassword('');
                setConfirmPassword('');
                setStep('changePassword');
            } else {
                commonErrorToast(response?.message || 'OTP validation failed');
            }
        } catch (error) {
            commonErrorToast('OTP validation failed - ' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword.trim() || !confirmPassword.trim()) {
            commonErrorToast('Please enter New Password and Confirm Password');
            return;
        }
        if (newPassword !== confirmPassword) {
            commonErrorToast('New Password and Confirm Password do not match');
            return;
        }
        const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword);
        if (!isValidPassword) {
            commonErrorToast('Password must be at least 8 characters long and include at least one letter and one number');
            return;
        }
        setLoading(true);
        try {
            const response: any = await ChangeUserPassword({
                userId: userId.trim(),
                oldPassword: '385ABF5E984F',
                newPassword: newPassword.trim(),
                mobileNo: mobileNo.trim(),
            });
            if (response?.statusCode === 200 && response?.message === 'Password changed successfully.') {
                commonSuccessToast(response.message);
                resetAndClose();
            } else {
                commonErrorToast(response?.message || 'Unable to change password');
            }
        } catch (error) {
            commonErrorToast('Unable to change password - ' + error);
        } finally {
            setLoading(false);
        }
    };

    const stepTitle = step === 'validate' ? 'Forgot Password' : step === 'otp' ? 'Validate OTP' : 'Change Password';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <button type="button" className="absolute right-3 top-3 cursor-pointer" aria-label="Close" onClick={resetAndClose}>
                    <MdOutlineClose color="red" size={22} />
                </button>
                <h2 className="mb-5 pr-8 text-xl font-bold text-gray-900">{stepTitle}</h2>

                {step === 'validate' && (
                    <form className="space-y-4" autoComplete="off" onSubmit={handleValidateUser}>
                        <p className="text-sm text-gray-600">Please enter your User Id and Registered Mobile Number to receive OTP.</p>
                        <div>
                            <label htmlFor="forgotUserId" className="mb-1 block text-sm font-medium text-gray-700">
                                User Id
                            </label>
                            <input
                                id="forgotUserId"
                                name="forgotUserId"
                                type="text"
                                autoComplete="off"
                                className={inputClass}
                                placeholder="Enter User Id"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="forgotMobileNo" className="mb-1 block text-sm font-medium text-gray-700">
                                Mobile No.
                            </label>
                            <input
                                id="forgotMobileNo"
                                type="tel"
                                className={inputClass}
                                placeholder="Enter Mobile No."
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-gradient flex h-[44px] w-full items-center justify-center rounded-full border-0 bg-pink-500 uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-80"
                        >
                            {loading ? (
                                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <form className="space-y-4" onSubmit={handleValidateOtp}>
                        <p className="text-sm text-gray-600">Please enter the OTP sent to your Registered Mobile Number.</p>
                        <div>
                            <label htmlFor="forgotOtp" className="mb-1 block text-sm font-medium text-gray-700">
                                Enter OTP
                            </label>
                            <input
                                id="forgotOtp"
                                type="text"
                                inputMode="numeric"
                                className={inputClass}
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled={loading}
                                className="flex h-[44px] w-full items-center justify-center rounded-full border-0 bg-gray-300 font-semibold uppercase text-gray-800 disabled:opacity-80"
                                onClick={() => setStep('validate')}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-gradient flex h-[44px] w-full items-center justify-center rounded-full border-0 bg-pink-500 uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-80"
                            >
                                {loading ? (
                                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
                                ) : (
                                    'Validate OTP'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 'changePassword' && (
                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        <div>
                            <label htmlFor="forgotNewPassword" className="mb-1 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="forgotNewPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    className={`${inputClass} pr-10`}
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                >
                                    {showNewPassword ? <IoEyeOff /> : <IoEye />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="forgotConfirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="forgotConfirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`${inputClass} pr-10`}
                                    placeholder="Enter Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-gradient flex h-[44px] w-full items-center justify-center rounded-full border-0 bg-pink-500 uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-80"
                        >
                            {loading ? (
                                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
                            ) : (
                                'Change Password'
                            )}
                        </button>
                        <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-600">
                            <p className="font-medium">Valid password must:</p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-5">
                                <li>At least 8 characters long</li>
                                <li>At least one letter (A-Z or a-z)</li>
                                <li>At least one number (0-9)</li>
                            </ul>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
