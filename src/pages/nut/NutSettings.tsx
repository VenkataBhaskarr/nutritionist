import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';

interface NotificationSetting {
  type: string;
  description: string;
  email: boolean;
  push: boolean;
}

const NutSettings: FC = () => {
  const notificationSettings: NotificationSetting[] = [
    {
      type: 'New Client Requests',
      description: 'Receive notifications when new clients request to work with you',
      email: true,
      push: true
    },
    {
      type: 'Session Reminders',
      description: 'Get reminders about upcoming client sessions',
      email: true,
      push: true
    },
    {
      type: 'Client Updates',
      description: 'Notifications when clients update their progress or send messages',
      email: false,
      push: true
    },
    {
      type: 'Payment Notifications',
      description: 'Receive updates about payments and transactions',
      email: true,
      push: false
    }
  ];

  return (
    // <DashboardLayout title="Settings" userRole="nutritionist">
    //   <div className="space-y-6">
    //     <div className="flex justify-between items-center">
    //       <h1 className="text-3xl font-bold">Settings</h1>
    //       <Button className="bg-primary-500">Save Changes</Button>
    //     </div>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Account Settings</CardTitle>
    //       </CardHeader>
    //       <CardContent className="space-y-4">
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div className="space-y-2">
    //             <label className="font-medium">Time Zone</label>
    //             <select className="w-full p-2 border rounded-md">
    //               <option>Asia/Kolkata (GMT+5:30)</option>
    //               <option>Pacific Time (PT)</option>
    //               <option>Eastern Time (ET)</option>
    //             </select>
    //           </div>
    //           <div className="space-y-2">
    //             <label className="font-medium">Language</label>
    //             <select className="w-full p-2 border rounded-md">
    //               <option>English</option>
    //               <option>Spanish</option>
    //               <option>French</option>
    //             </select>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Separator />

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Notification Preferences</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-6">
    //           {notificationSettings.map((setting, index) => (
    //             <div key={index} className="flex items-start justify-between">
    //               <div>
    //                 <h3 className="font-medium">{setting.type}</h3>
    //                 <p className="text-sm text-gray-500">{setting.description}</p>
    //               </div>
    //               <div className="flex space-x-4">
    //                 <label className="flex items-center space-x-2">
    //                   <input 
    //                     type="checkbox" 
    //                     defaultChecked={setting.email}
    //                     className="rounded border-gray-300"
    //                   />
    //                   <span className="text-sm">Email</span>
    //                 </label>
    //                 <label className="flex items-center space-x-2">
    //                   <input 
    //                     type="checkbox" 
    //                     defaultChecked={setting.push}
    //                     className="rounded border-gray-300"
    //                   />
    //                   <span className="text-sm">Push</span>
    //                 </label>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Session Settings</CardTitle>
    //       </CardHeader>
    //       <CardContent className="space-y-4">
    //         <div className="space-y-2">
    //           <label className="font-medium">Default Session Duration</label>
    //           <select className="w-full p-2 border rounded-md">
    //             <option>30 minutes</option>
    //             <option>45 minutes</option>
    //             <option>60 minutes</option>
    //           </select>
    //         </div>
    //         <div className="space-y-2">
    //           <label className="font-medium">Buffer Time Between Sessions</label>
    //           <select className="w-full p-2 border rounded-md">
    //             <option>5 minutes</option>
    //             <option>10 minutes</option>
    //             <option>15 minutes</option>
    //           </select>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Separator />

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Privacy Settings</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <label className="flex items-center space-x-2">
    //             <input 
    //               type="checkbox" 
    //               defaultChecked={true}
    //               className="rounded border-gray-300"
    //             />
    //             <span>Show my profile in nutritionist directory</span>
    //           </label>
    //           <label className="flex items-center space-x-2">
    //             <input 
    //               type="checkbox" 
    //               defaultChecked={true}
    //               className="rounded border-gray-300"
    //             />
    //             <span>Allow clients to book sessions without approval</span>
    //           </label>
    //           <label className="flex items-center space-x-2">
    //             <input 
    //               type="checkbox" 
    //               defaultChecked={false}
    //               className="rounded border-gray-300"
    //             />
    //             <span>Share my client success stories publicly</span>
    //           </label>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </DashboardLayout>
     <div>
      Under Construction
    </div>
  );
};

export default NutSettings;
