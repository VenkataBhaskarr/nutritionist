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

interface ReminderSetting {
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

const ClientSettings: FC = () => {
  const notificationSettings: NotificationSetting[] = [
    {
      type: 'Session Reminders',
      description: 'Get notified about upcoming nutrition sessions',
      email: true,
      push: true
    },
    {
      type: 'Progress Updates',
      description: 'Receive summaries of your progress and achievements',
      email: true,
      push: false
    },
    {
      type: 'Diet Plan Updates',
      description: 'Get notified when your nutritionist updates your diet plan',
      email: true,
      push: true
    },
    {
      type: 'Tips & Resources',
      description: 'Receive helpful nutrition tips and resources',
      email: false,
      push: true
    }
  ];

  const reminderSettings: ReminderSetting[] = [
    {
      type: 'Water Intake',
      frequency: 'daily',
      enabled: true
    },
    {
      type: 'Meal Logging',
      frequency: 'daily',
      enabled: true
    },
    {
      type: 'Weight Check',
      frequency: 'weekly',
      enabled: true
    },
    {
      type: 'Progress Photos',
      frequency: 'monthly',
      enabled: false
    }
  ];

  return (
    <div>
      Under Construction
    </div>
    // <DashboardLayout title="Settings" userRole="client">
    //   <div className="space-y-6">
    //     <div className="flex justify-between items-center">
    //       <h1 className="text-3xl font-bold">Settings</h1>
    //       <Button className="bg-primary-500">Save Changes</Button>
    //     </div>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Account Preferences</CardTitle>
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
    //             <label className="font-medium">Unit System</label>
    //             <select className="w-full p-2 border rounded-md">
    //               <option>Metric (kg, cm)</option>
    //               <option>Imperial (lbs, in)</option>
    //             </select>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Separator />

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Notification Settings</CardTitle>
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
    //         <CardTitle>Reminder Settings</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-6">
    //           {reminderSettings.map((reminder, index) => (
    //             <div key={index} className="flex items-start justify-between">
    //               <div>
    //                 <h3 className="font-medium">{reminder.type}</h3>
    //                 <p className="text-sm text-gray-500">
    //                   {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)} reminder
    //                 </p>
    //               </div>
    //               <div className="flex items-center space-x-4">
    //                 <select 
    //                   className="p-2 border rounded-md text-sm"
    //                   defaultValue={reminder.frequency}
    //                 >
    //                   <option value="daily">Daily</option>
    //                   <option value="weekly">Weekly</option>
    //                   <option value="monthly">Monthly</option>
    //                 </select>
    //                 <label className="flex items-center space-x-2">
    //                   <input 
    //                     type="checkbox" 
    //                     defaultChecked={reminder.enabled}
    //                     className="rounded border-gray-300"
    //                   />
    //                   <span className="text-sm">Enabled</span>
    //                 </label>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>

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
    //             <span>Share my progress with my nutritionist</span>
    //           </label>
    //           <label className="flex items-center space-x-2">
    //             <input 
    //               type="checkbox" 
    //               defaultChecked={false}
    //               className="rounded border-gray-300"
    //             />
    //             <span>Allow my success story to be featured</span>
    //           </label>
    //           <label className="flex items-center space-x-2">
    //             <input 
    //               type="checkbox" 
    //               defaultChecked={true}
    //               className="rounded border-gray-300"
    //             />
    //             <span>Receive personalized nutrition recommendations</span>
    //           </label>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Danger Zone</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="p-4 border border-red-200 rounded-lg bg-red-50">
    //             <h3 className="text-lg font-medium text-red-800">Delete Account</h3>
    //             <p className="text-sm text-red-600 mt-1">
    //               Permanently delete your account and all associated data. This action cannot be undone.
    //             </p>
    //             <Button 
    //               variant="destructive" 
    //               size="sm" 
    //               className="mt-4"
    //             >
    //               Delete Account
    //             </Button>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </DashboardLayout>
  );
};

export default ClientSettings;
