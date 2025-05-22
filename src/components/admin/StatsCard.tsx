import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <Card className="border-l-4 border-l-primary-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">{value}</div>
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
