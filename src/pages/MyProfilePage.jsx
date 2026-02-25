import React, { useState, useEffect } from "react";
import { H2 } from "../components/ui/Text";
import { toast } from "react-toastify";
import api from "../api";
import { useAuth } from "../api/AuthContext";
import { User, Mail, KeyRound, Save, Loader2, UserCog, UserRoundPen, Eye, EyeOff, Camera } from "lucide-react"; // Import Eye and EyeOff

export default function MyProfilePage() {
  // Ambil data user dari context global
  const { user, loading, refreshUser } = useAuth();

  //state lokal
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);

  // States for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAlias(user.alias || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setRole(user.role || "");
      setPreviewImage(user.profile_image_url || null)
    }
  }, [user]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('alias', alias);
    formData.append('bio', bio);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      const response = await api.post("/api/user/profile", formData, {
         headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        if (refreshUser) refreshUser();
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPasswordChange(true);

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      setLoadingPasswordChange(false);
      return;
    }
    if (newPassword.length < 6) { 
      toast.error("New password must be at least 6 characters long.");
      setLoadingPasswordChange(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password.");
    } finally {
      setLoadingPasswordChange(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

      <div className="mb-6">
        <H2>My Profile</H2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information and password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={previewImage || `https://ui-avatars.com/api/?name=${name}&background=random`}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <label htmlFor="profileImage" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                  <Camera size={16} />
                  Change Picture
                  <input
                    type="file"
                    id="profileImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loadingProfile}
                  />
                </label>
              </div>
            </div>
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
               Full Name
              </label>
              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text" 
                  id="name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loadingProfile}
                />
              </div>
            </div>
            <div>
              <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-1">
                Alias / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="alias"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  disabled={loadingProfile}
                />
              </div>
            </div>
             <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <div className="relative">
                <UserRoundPen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <textarea 
                  id="bio"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm min-h-[80px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={loadingProfile}
                ></textarea>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  value={email}
                  disabled
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="role"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  value={role}
                  disabled
                />
              </div>
            </div>
           <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingProfile}
            >
              {loadingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showCurrentPassword ? "text" : "password"} // Dynamic type
                  id="currentPassword"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loadingPasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showNewPassword ? "text" : "password"} // Dynamic type
                  id="new_password"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loadingPasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmNewPassword ? "text" : "password"} // Dynamic type
                  id="confirmNewPassword"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={loadingPasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingPasswordChange}
            >
              {loadingPasswordChange ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loadingPasswordChange ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}