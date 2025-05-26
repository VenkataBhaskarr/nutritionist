// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
// } from "@/components/ui/chart";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   ActivitySquare,
//   BarChart3,
//   LineChart as LineChartIcon,
//   PieChart as PieChartIcon,
//   Loader2,
// } from "lucide-react";


// interface AnalyticsSectionProps {
//   clientGrowth: ClientGrowthData[];
//   ratioTrends: RatioTrendData[];
//   userEngagement: UserEngagementData[];
//   loading: boolean;
// }

// const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
//   clientGrowth,
//   ratioTrends,
//   userEngagement,
//   loading,
// }) => {
//   const COLORS = ["#4CB28A", "#6BD0A2", "#8DDEBA", "#B0ECD1"];

//   const chartConfig = {
//     clients: {
//       label: "Clients",
//       theme: {
//         light: "#4CB28A",
//         dark: "#4CB28A",
//       },
//     },
//     ratio: {
//       label: "Ratio",
//       theme: {
//         light: "#6BD0A2",
//         dark: "#6BD0A2",
//       },
//     },
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center">
//         <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
//         <h2 className="text-lg font-semibold">Analytics</h2>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2">
//           {/* Client Growth Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm font-medium flex items-center">
//                 <LineChartIcon className="w-4 h-4 mr-2 text-primary-500" />
//                 Client Growth Over Time
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-72">
//                 <ChartContainer config={chartConfig}>
//                   <LineChart
//                     data={clientGrowth}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <ChartLegend content={<ChartLegendContent />} />
//                     <Line
//                       type="monotone"
//                       dataKey="clients"
//                       stroke="#4CB28A"
//                       activeDot={{ r: 8 }}
//                     />
//                   </LineChart>
//                 </ChartContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Nutritionist-to-Client Ratio Trends */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm font-medium flex items-center">
//                 <LineChartIcon className="w-4 h-4 mr-2 text-primary-500" />
//                 Nutritionist-to-Client Ratio Trends
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-72">
//                 <ChartContainer config={chartConfig}>
//                   <BarChart
//                     data={ratioTrends}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <ChartLegend content={<ChartLegendContent />} />
//                     <Bar dataKey="ratio" fill="#6BD0A2" />
//                   </BarChart>
//                 </ChartContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* User Engagement Statistics */}
//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-sm font-medium flex items-center">
//                 <ActivitySquare className="w-4 h-4 mr-2 text-primary-500" />
//                 User Engagement Statistics
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-72 flex items-center justify-center">
//                 <div className="w-full md:w-1/2 h-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={userEngagement}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={90}
//                         fill="#8884d8"
//                         dataKey="value"
//                         nameKey="metric"
//                         label={({metric, value}) => `${metric}: ${value}`}
//                       >
//                         {userEngagement.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnalyticsSection;

