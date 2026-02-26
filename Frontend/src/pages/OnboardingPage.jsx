import React, { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon , MapPinIcon , ShuffleIcon , ShipWheelIcon , LoaderIcon} from 'lucide-react';
import { LANGUAGES } from '../constants';

// Builds a deterministic DiceBear URL from a seed string.
const buildAvatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

// Creates an inline SVG avatar used when remote image loading fails.
const buildFallbackAvatar = (name = 'User') => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'U';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#334155">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const OnboardingPage = () => {
  // Read currently authenticated user details used to bootstrap onboarding.
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // Pre-fill onboarding inputs from the authenticated user's current profile.
  const [formState, setFormState] = useState(() => ({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',
  }));

  const { mutate: onboardingMutation , isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('Profile onboarded successfully');
      // Refresh cached auth user so the UI reflects saved onboarding data.
      setTimeout(()=>{
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
      },1000)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formState,
      fullname: formState.fullname.trim(),
      bio: formState.bio.trim(),
      nativeLanguage: formState.nativeLanguage.trim(),
      learningLanguage: formState.learningLanguage.trim(),
      location: formState.location.trim(),
    };

    // Send the full onboarding payload in one request.
    onboardingMutation(payload);
  };

  const handleRandomAvatar = () => {
    // Combine name + timestamp + random suffix to avoid repeating avatar seeds.
    const seed = `${formState.fullname || 'user'}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const randomAvatar = buildAvatarUrl(seed);
    setFormState((prev) => ({
      ...prev,
      profilePic: randomAvatar,
    }));
  }; 

  return (
    <div className='min-h-screen flex items-center justify-center p-4' data-theme='winter'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          {/* Header section */}
          <h1 className='text-3xl sm:text-3xl font-bold text-center mb-3'>Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className=' space-y-6'>
            {/* Avatar preview + random generator controls */}
            <div className='flex flex-col items-center space-y-4'>
              <div className='size-32 flex justify-center rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt='Profile preview'
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      // Avoid infinite error loops, then fallback to generated initials avatar.
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = buildFallbackAvatar(formState.fullname);
                    }}
                  />
                ) : (
                  <div className='flex item-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40'></CameraIcon>
                  </div>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-outline btn-primary'>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* Basic profile identity fields */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input
                type='text'
                name='fullname'
                value={formState.fullname}
                onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
                className='input input-bordered w-full rounded-2xl'
                placeholder='Your Full Name'
                required
              />
            </div>

            {/* Short self-introduction shown to other users */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                type='text'
                name='bio'
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className='textarea textarea-bordered h-24 rounded-2xl'
                placeholder='Tell others about Yourself and your language learning goals'
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className='label-text'>Native Langauge</span>
                </label>
                <select name="nativeLanguage" value={formState.nativeLanguage} onChange={
                  (e)=>{setFormState({...formState, nativeLanguage: e.target.value})}
                } className='select select-bordered w-full rounded-2xl' required>
                  <option value="">Select Your Native Langauge</option>
                  {LANGUAGES.map((lang)=>(
                    <option value={lang.toLowerCase()} key={`native-${lang}`}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className='label-text'>Learning Langauge</span>
                </label>
                <select name="learningLanguage" value={formState.learningLanguage} onChange={
                  (e)=>{setFormState({...formState, learningLanguage: e.target.value})}
                } className='select select-bordered w-full rounded-2xl' required>
                  <option value="">Select Your learning Langauge</option>
                  {LANGUAGES.map((lang)=>(
                    <option value={lang.toLowerCase()} key={`learning-${lang}`}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
                <label className="label">
                  <span className='label-text'>Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                  <input type="text" name='location' value={formState.location} onChange={(e) => setFormState({...formState, location: e.target.value})} className='input input-bordered w-full pl-10 rounded-2xl' placeholder='City, Country' required/>
                </div>
            </div>

            <button className='btn btn-primary w-full' disabled={isPending} type='submit' > {!isPending?(
              <>
                <ShipWheelIcon className='size-8 mr-2'/> Complete Onboarding
              </>
            ):(
              <>
                <LoaderIcon className="animate-spin size-8  mr-2"/>
                Onboarding
              </>
            )} </button>


          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
