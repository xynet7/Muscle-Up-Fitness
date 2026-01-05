'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query, getDocs, Timestamp, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, PieChart, User } from 'lucide-react';
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';

interface UserAttendanceData {
  userId: string;
  userName: string;
  userEmail: string;
  presentDays: number;
  totalDaysInMonth: number;
}

const COLORS = ['#16a34a', '#e2e8f0']; // Green for present, Gray for absent

export default function AdminAttendancePage() {
  const firestore = useFirestore();
  const [attendanceData, setAttendanceData] = useState<UserAttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  useEffect(() => {
    if (!firestore || isLoadingUsers || !isClient) return;

    const fetchAttendanceData = async () => {
      setIsLoading(true);
      setError(null);
      if (!users) {
        setIsLoading(false);
        return;
      }

      try {
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const totalDaysInMonth = getDaysInMonth(now);

        const attendancePromises = users.map(async (user) => {
          const attendanceColRef = collection(firestore, `users/${user.id}/attendance`);
          const q = query(attendanceColRef, where('date', '>=', monthStart), where('date', '<=', monthEnd));
          const querySnapshot = await getDocs(q);
          const presentDays = querySnapshot.size;

          return {
            userId: user.id,
            userName: user.displayName || user.email || 'Unknown User',
            userEmail: user.email,
            presentDays,
            totalDaysInMonth,
          };
        });

        const results = await Promise.all(attendancePromises);
        setAttendanceData(results);
      } catch (err: any) {
        setError("Failed to fetch attendance data. Check permissions or network.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [firestore, users, isLoadingUsers, isClient]);

  const renderContent = () => {
    if (isLoading || !isClient) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (error) {
       return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
       )
    }

    if (attendanceData.length === 0) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No user attendance data found for the current month.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceData.map((data) => {
          const chartData = [
            { name: 'Present', value: data.presentDays },
            { name: 'Absent', value: data.totalDaysInMonth - data.presentDays },
          ];

          return (
            <Card key={data.userId}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-medium">{data.userName}</CardTitle>
                  <CardDescription className="text-xs">{data.userEmail}</CardDescription>
                </div>
                 <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <p className="text-2xl font-bold">
                    {data.totalDaysInMonth > 0 ? ((data.presentDays / data.totalDaysInMonth) * 100).toFixed(0) : 0}%
                 </p>
                 <p className="text-xs text-muted-foreground">
                    {data.presentDays} of {data.totalDaysInMonth} days attended this month
                </p>
                <div className="h-[200px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} days`} />
                      <Legend iconSize={10} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">User Attendance</h1>
        <p className="text-muted-foreground">Monthly attendance overview for all members.</p>
      </div>
      {renderContent()}
    </div>
  );
}
