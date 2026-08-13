import { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';
import { ChangeUserPassword } from '../../services/login/loginSevice';

type ForceChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    mobileNo: string;
};

const inputClass =
    'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

const PasswordField = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    showPassword,
    onToggle,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    showPassword: boolean;
    onToggle: () => void;
}) => (
    <div>
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="relative">
            <input
                id={id}
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                className={`${inputClass} pr-10`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type="button"
                aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
                className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={onToggle}
            >
                {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
        </div>
    </div>
);

const ForceChangePasswordModal = ({ isOpen, onClose, userId, mobileNo }: ForceChangePasswordModalProps) => {
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetAndClose = () => {
        setLoading(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            commonErrorToast('Please enter Old Password, New Password and Confirm Password');
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
                userId,
                oldPassword: oldPassword.trim(),
                newPassword: newPassword.trim(),
                mobileNo,
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <button type="button" className="absolute right-3 top-3 cursor-pointer" aria-label="Close" onClick={resetAndClose}>
                    <MdOutlineClose color="red" size={22} />
                </button>
                <h2 className="mb-5 pr-8 text-xl font-bold text-gray-900">Change Password</h2>
                <form className="space-y-4" autoComplete="off" onSubmit={handleChangePassword}>
                    <p className="text-sm text-gray-600">Please change your password to continue.</p>
                    <PasswordField
                        id="forceOldPassword"
                        label="Old Password"
                        placeholder="Enter Old Password"
                        value={oldPassword}
                        onChange={setOldPassword}
                        showPassword={showOldPassword}
                        onToggle={() => setShowOldPassword((prev) => !prev)}
                    />
                    <PasswordField
                        id="forceNewPassword"
                        label="New Password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        showPassword={showNewPassword}
                        onToggle={() => setShowNewPassword((prev) => !prev)}
                    />
                    <PasswordField
                        id="forceConfirmPassword"
                        label="Confirm Password"
                        placeholder="Enter Confirm Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        showPassword={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((prev) => !prev)}
                    />
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
            </div>
        </div>
    );
};

export default ForceChangePasswordModal;
