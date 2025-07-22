
"use client"

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Megaphone, FileText, DollarSign, ArrowUpRight } from '@/components/common/icons';
import Link from "next/link";

const overviewData = [
    { title: "Active Campaigns", value: "12", icon: Megaphone, change: "+2", changeType: "increase" },
    { title: "Scheduled Posts", value: "48", icon: FileText, change: "-5", changeType: "decrease" },
    { title: "Monthly Revenue", value: "$7,849", icon: DollarSign, change: "+15.2%", changeType: "increase" },
];

const recentPosts = [
    { id: 1, title: "Nike Air Max Dn: The Next Generation of Air", status: "Published", channel: "Blogger", date: "2024-05-20" },
    { id: 2, title: "50% off Sage Accounting for 6 months!", status: "Scheduled", channel: "LinkedIn", date: "2024-05-22" },
    { id: 3, title: "Unleash creativity with Adobe Creative Cloud", status: "Draft", channel: "Meta", date: "2024-05-25" },
    { id: 4, title: "New Product Launch: Content Spark AI", status: "Published", channel: "X", date: "2024-05-18" },
    { id: 5, title: "Behind the scenes at Impact Explorer", status: "Draft", channel: "Blogger", date: "2024-05-28" },
];

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'published':
            return <Badge variant="default">Published</Badge>;
        case 'scheduled':
            return <Badge variant="secondary">Scheduled</Badge>;
        case 'draft':
            return <Badge variant="outline">Draft</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Dashboard" 
        description="Your command center for content and affiliate campaigns."
        icon={LayoutDashboard}
        action={
            <Link href="/create-content">
              <Button>Create New Post</Button>
            </Link>
        }
      />

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {overviewData.map((item, index) => (
             <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className={`text-xs ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change} from last month
                    </p>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Recent Posts Table */}
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle>Recent & Upcoming Posts</CardTitle>
              <CardDescription>A list of your most recent drafts, scheduled, and published content.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {recentPosts.map((post) => (
                          <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{getStatusBadge(post.status)}</TableCell>
                              <TableCell className="text-muted-foreground">{post.channel}</TableCell>
                              <TableCell className="text-muted-foreground">{post.date}</TableCell>
                              <TableCell className="text-right">
                                  <Button variant="outline" size="sm">
                                      View
                                      <ArrowUpRight className="ml-2 h-4 w-4" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

    </AppLayout>
  );
}
