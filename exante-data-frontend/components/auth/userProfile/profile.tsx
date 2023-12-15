import { RootState } from "@/redux/store";
import { FC } from "react";
import { useSelector } from "react-redux";

const UserProfile: FC = () => {
    const userInfo = useSelector(
        (state:RootState)=> state.loginUser.userData
    )
  return (
    <div className="bg-gray-100  py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="font-bold">{userInfo.name}</h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Bio</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            pellentesque magna non felis pretium, sit amet malesuada quam
            eleifend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
