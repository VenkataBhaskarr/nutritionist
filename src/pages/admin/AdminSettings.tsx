import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  status: 'enabled' | 'disabled';
}

const AdminSettings: FC = () => {
  const settingSections: SettingSection[] = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Configure system-wide email notification settings for users',
      status: 'enabled',
    },
    {
      id: 'registration',
      title: 'User Registration',
      description: 'Control new user registration and approval process',
      status: 'enabled',
    },
    {
      id: 'payment',
      title: 'Payment Processing',
      description: 'Manage payment gateway settings and transaction fees',
      status: 'enabled',
    },
    {
      id: 'backup',
      title: 'Data Backup',
      description: 'Configure automated backup settings and retention policies',
      status: 'enabled',
    },
  ];

  return (
    <DashboardLayout title="Admin Settings" userRole="admin">
       <div>
      Under Construction
    </div>
      {/* <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button className="bg-primary-500">Save Changes</Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-medium">Platform Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    defaultValue="Livin Significant"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium">Support Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    defaultValue="support@livinsignificant.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {settingSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        section.status === 'enabled'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {section.status}
                    </span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800">Reset Platform Data</h3>
                  <p className="text-sm text-red-600 mt-1">
                    This action will permanently delete all platform data. This cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-4">
                    Reset Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}
    </DashboardLayout>
    
  );
};

export default AdminSettings;
