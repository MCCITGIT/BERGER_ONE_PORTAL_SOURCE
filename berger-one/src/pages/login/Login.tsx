import { useEffect, useState } from 'react';
import { GetProdDevImgRouteBuilder } from '../../services/functions/getProdDevUrlBuilder'
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { IoEye, IoEyeOff } from "react-icons/io5";
// import { ValidateLogin } from '../../services/api/login/loginSevice';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UseAuthStore } from '../../services/store/AuthStore';
import { ValidateLogin } from '../../services/login/loginSevice';
import ForgotPasswordModal from './ForgotPasswordModal';
import ForceChangePasswordModal from './ForceChangePasswordModal';
// import { UseAuthStore } from '../../services/store/AuthStore';

const Login = () => {
    const { login }: any = UseAuthStore();
    // const user = UseAuthStore((state: any) => state.userDetails);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showForceChangePassword, setShowForceChangePassword] = useState(false);
    const [forceChangeUser, setForceChangeUser] = useState({ userId: '', mobileNo: '' });

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let postObj: { user_id: any; password: any } = { user_id: loginData.email, password: loginData.password };
        try {
            const response: any = await ValidateLogin(postObj);
            if (response && response.success && response.message && response.token) {
                if (response.data?.pwd_reset_required_yn === 'Y') {
                    setForceChangeUser({
                        userId: response.data?.user_id || loginData.email,
                        mobileNo: response.data?.mobile || '',
                    });
                    setShowForceChangePassword(true);
                    return;
                }
                const user = { userDetails: response };
                localStorage.setItem('_token', response.token);
                localStorage.setItem('_refresh_token', response.refresh_token);
                commonSuccessToast('Login Successful');
                login(user);
                Cookies.set('authToken', response.token);
                // setTimeout(() => navigate('/'));
                setTimeout(() => {
                    window.location.href = "/BERGERONE/";
                }, 100);
            } else {
                commonErrorToast(response.message);
            }
        } catch (error) {
            commonErrorToast('Login Failed - ' + error);
        } finally {
            setLoading(false); // Stop loading after the operation is complete
        }
    };

    useEffect(() => {
        const reloaded = sessionStorage.getItem("login_reloaded");
      
        if (!reloaded) {
          sessionStorage.setItem("login_reloaded", "true");
          window.location.reload();
        }
      }, []);


    return (
        <div>
            <div className="bgImgFixed absolute inset-0">
                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/bg-gradient.png')} alt="image" className="h-full w-full object-cover" />
            </div>
            <div
                className={`bgImgFixed relative flex min-h-screen items-center justify-center bg-[url(${GetProdDevImgRouteBuilder(
                    '/assets/images/auth/map.png'
                )})] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16`}
            >
                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/coming-soon-object1.png')} alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/coming-soon-object2.png')} alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/coming-soon-object3.png')} alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/polygon-object.svg')} alt="image" className="absolute bottom-0 end-[28%]" />

                <div className="h-100 relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <img src={GetProdDevImgRouteBuilder('/assets/images/berger.png')} alt="Logo" className="mx-auto mt-20" />
                            <div className="hidden w-full max-w-[430px] lg:block">
                                <img src={GetProdDevImgRouteBuilder('/assets/images/auth/login.svg')} alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl dark:text-white">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark dark:text-slate-500">Enter your User ID and Password to Login</p>
                            </div>
                            <form className="space-y-5 dark:text-white">
                                <div>
                                    <label htmlFor="Email">User ID</label>
                                    <div className="relative text-white-dark">
                                        {/* <input id="Email" type="text" {...register('user_id')} placeholder="Enter User Id" className="form-input ps-10 placeholder:text-white-dark" /> */}
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Enter User ID"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IoMdMail />
                                        </span>
                                    </div>
                                    {/* <div className="text-danger">{errors.user_id?.message}</div> */}
                                </div>

                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        {/* <input id="Password" type="password" {...register('password')} placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" /> */}
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Enter Password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <RiLockPasswordFill />
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer text-white-dark hover:text-gray-700"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <IoEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {/* <div className="text-danger">{errors.password?.message}</div> */}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-sm font-semibold text-primary hover:underline"
                                        onClick={() => setShowForgotPassword(true)}
                                    >
                                        Forgot password ?
                                    </button>
                                </div>

                                {/* Submit button with loader when loading is true */}
                                <button
                                    type="submit"
                                    className="btn btn-gradient rounded-full bg-pink-500 !mt-6 flex h-[48px] w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-80"
                                    onClick={(e) => handleSubmit(e)}
                                    disabled={loading} // Disable button while loading
                                >
                                    {loading ? (
                                        <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" role="status">
                                            <span className="clip-rect(0,0,0,0) absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FaCheck className="mr-2 text-white" />
                                            Sign in
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                        <p className="absolute text-xs bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.Berger Paints All Rights Reserved.</p>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
            <ForceChangePasswordModal
                isOpen={showForceChangePassword}
                onClose={() => setShowForceChangePassword(false)}
                userId={forceChangeUser.userId}
                mobileNo={forceChangeUser.mobileNo}
            />
        </div>
    );
};

export default Login