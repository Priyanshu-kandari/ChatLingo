import React, { useState } from 'react';
import { MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';

const SignUpPage = () => {
  // Local form state for signup inputs.
  const [signupData, setSignupData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  // React Query client for cache invalidation after successful signup.
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });

  // Prevent default page reload on submit, then trigger signup request.
  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  };

  return (
    <div className="h-screen flex items-center p-4 sm:p-6 md:p-8" data-theme="winter">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left panel: signup form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Brand/logo */}
          <div className="flex items-center mb-4 justify-start gap-2">
            <MessagesSquare className="size-9 text-primary" />
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatLingo
            </span>
          </div>

          {/* Backend/API error state */}
          {error && (
            <div className="alert alert-error mb-4 p-2 flex justify-center">
              <span>{error.response.data.message}</span>
            </div>
          )}

          {/* Signup form */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl mt-3 font-semibold">Create an Account</h2>
                  <p>Join Streamify and Start your language learning adventure!</p>
                </div>

                {/* Input fields */}
                <div className="space-y-3">
                  <div className="from-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullname}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullname: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="from-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="John@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="from-control w-full">
                    <label className="label">
                      <span className="label-text">password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="XXXXXXXX"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1 ml-2">
                      Password must be 8 Characters long
                    </p>
                  </div>

                  {/* Terms consent */}
                  <div className="from-control w-full">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{' '}
                        <span className="text-primary hover:underline">Terms of Service </span>
                        and <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button className="btn rounded-3xl btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs">Loading...</span>
                    </>
                  ) : (
                    'create Account'
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover: underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right panel: illustration and marketing text */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/Video call-rafiki.svg"
                alt="Language Connection illustration"
                className="w-full h-full object-cover scale-150"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with Laguage partners Worldwide</h2>
              <p className="opacity-70">
                practice conversation , make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
