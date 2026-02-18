'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// ============================================================
// KFS EDUCATOR SIGN-IN & FREEBIE PORTAL
// Verified educators get free classroom streaming access.
// Once kuts are proven, 1 approved kut ships monthly.
// All content gated by silent approval (contentApprovalRequired).
// ============================================================

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function EducatorsPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    district: '',
    grade_levels: '',
    state: '',
    how_heard: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      const res = await fetch('/api/educators/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* HERO */}
          <div className="text-center mb-12">
            <span className="inline-block bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Educator Program
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Free Classroom Music
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Verified educators get free streaming access to pediatric &amp; classroom-approved
              Kids Fun Songs. Once tracks are proven in classrooms, we send 1 approved
              kut to each educator every month.
            </p>
          </div>

          {/* HOW IT WORKS */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-sm text-gray-500">Verify your .edu email or school credentials</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-[#00BCD4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Stream Free</h3>
              <p className="text-sm text-gray-500">Access approved KFS singalongs for your classroom</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Monthly Kuts</h3>
              <p className="text-sm text-gray-500">Once proven, receive 1 new approved kut every month</p>
            </div>
          </div>

          {/* SIGN-UP FORM */}
          {formState === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Application Received!</h2>
              <p className="text-green-600">
                We will verify your credentials and send your access within 48 hours.
                Thank you for bringing music to your classroom.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Educator Sign-In</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text" name="name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Email</label>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="name@school.edu"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      type="text" name="school" required
                      value={formData.school} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="Your school"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text" name="district"
                      value={formData.district} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="School district"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Levels</label>
                    <input
                      type="text" name="grade_levels" required
                      value={formData.grade_levels} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="e.g. K-3, PreK, 4-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text" name="state" required
                      value={formData.state} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                      placeholder="e.g. Illinois"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select
                    name="how_heard"
                    value={formData.how_heard} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                  >
                    <option value="">Select...</option>
                    <option value="colleague">Colleague / Teacher</option>
                    <option value="conference">Conference / Workshop</option>
                    <option value="social">Social Media</option>
                    <option value="search">Google / Search</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {formState === 'error' && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                    Something went wrong. Please try again or email support.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold py-4 px-8 rounded-xl text-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {formState === 'submitting' ? 'Submitting...' : 'Apply for Free Access'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By signing up you agree to classroom-only streaming. All content is
                  curated and approved by G Putnam Music LLC.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
