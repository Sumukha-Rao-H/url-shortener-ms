import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const mockUrls = [
  {
    short_url: 'a8267e',
    original_url: 'https://reddit.com/',
    visits: [
      { date: '2025-06-15', count: 3 },
      { date: '2025-06-16', count: 5 },
      { date: '2025-06-17', count: 10 },
    ],
  },
  {
    short_url: 'adcea9',
    original_url: 'https://youtube.com/',
    visits: [
      { date: '2025-06-15', count: 8 },
      { date: '2025-06-16', count: 7 },
      { date: '2025-06-17', count: 4 },
    ],
  },
  {
    short_url: 'b129fd',
    original_url: 'https://github.com/',
    visits: [
      { date: '2025-06-15', count: 2 },
      { date: '2025-06-16', count: 3 },
      { date: '2025-06-17', count: 1 },
    ],
  },
  {
    short_url: 'f93ad1',
    original_url: 'https://stackoverflow.com/',
    visits: [
      { date: '2025-06-15', count: 4 },
      { date: '2025-06-16', count: 1 },
      { date: '2025-06-17', count: 2 },
    ],
  },
];

export default function AnalyticsPage() {
  const [selectedUrl, setSelectedUrl] = useState(mockUrls[0].short_url);
  const [showTopChart, setShowTopChart] = useState(false);

  const activeUrl = mockUrls.find((url) => url.short_url === selectedUrl);

  const leaderboard = [...mockUrls]
    .map((url) => ({
      label: url.original_url,
      short_url: url.short_url,
      original_url: url.original_url,
      total: url.visits.reduce((sum, v) => sum + v.count, 0),
    }))
    .sort((a, b) => b.total - a.total);

  const top10Data = leaderboard.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#F3F3E0] p-6 md:p-10 text-[#133E87]">
      {/* Header + Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* URL Selector */}
      <div className="mb-6 max-w-sm">
        <label className="block mb-2 font-semibold">Select URL</label>
        <Select value={selectedUrl} onValueChange={setSelectedUrl}>
          <SelectTrigger className="bg-white border border-[#133E87]">
            <SelectValue placeholder="Select a URL" />
          </SelectTrigger>
          <SelectContent>
            {mockUrls.map((url) => (
              <SelectItem key={url.short_url} value={url.short_url}>
                {url.original_url}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visit Trend Line Chart */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Visit Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activeUrl.visits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#133E87"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Total Visits per URL */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Total Visits per URL</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaderboard}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="original_url"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-15}
                height={80}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#608BC1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Toggleable Top 10 Chart */}
      {showTopChart && (
        <Card className="mb-8">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Top 10 URLs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top10Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="original_url"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  height={80}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#133E87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard List */}
      <Card>
        <CardContent className="p-4">
          <div className='flex justify-between'>
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            <Button
              onClick={() => setShowTopChart(!showTopChart)}
              className="bg-[#133E87] hover:bg-[#102f6e] text-white"
            >
              {showTopChart ? 'Hide' : 'Show'} Top 10 URLs Chart
            </Button>
          </div>
          <div className="space-y-2">
            {leaderboard.map((url, idx) => (
              <div
                key={url.short_url}
                className="bg-[#CBDCEB] p-3 rounded-lg flex justify-between items-center"
              >
                <div className="font-medium">
                  {idx + 1}. <span className="text-[#133E87]">{url.original_url}</span>
                </div>
                <div className="font-bold text-[#133E87]">{url.total} visits</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
