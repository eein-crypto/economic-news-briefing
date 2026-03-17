import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Clock, Mail } from 'lucide-react';
import { useLocation } from 'wouter';

interface Settings {
  briefingTime: string;
  notificationEnabled: boolean;
  notificationType: 'browser' | 'email';
  emailAddress: string;
}

const DEFAULT_SETTINGS: Settings = {
  briefingTime: '08:00',
  notificationEnabled: true,
  notificationType: 'browser',
  emailAddress: ''
};

export default function Settings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('briefingSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
  }, []);

  // Save settings to localStorage
  const handleSave = () => {
    localStorage.setItem('briefingSettings', JSON.stringify(settings));
    alert('설정이 저장되었습니다!');
    setLocation('/');
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      briefingTime: e.target.value
    }));
  };

  const handleNotificationToggle = () => {
    setSettings(prev => ({
      ...prev,
      notificationEnabled: !prev.notificationEnabled
    }));
  };

  const handleNotificationTypeChange = (type: 'browser' | 'email') => {
    setSettings(prev => ({
      ...prev,
      notificationType: type
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      emailAddress: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4 md:py-5 flex items-center gap-3">
          <button
            onClick={() => setLocation('/')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-foreground">설정</h1>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Briefing Time Setting */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">브리핑 시간</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  매일 뉴스 브리핑을 받을 시간을 선택하세요.
                </p>
                <input
                  type="time"
                  value={settings.briefingTime}
                  onChange={handleTimeChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Notification Setting */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <Bell className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">알림 설정</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  뉴스 브리핑이 준비되었을 때 알림을 받으시겠어요?
                </p>
                
                {/* Toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.notificationEnabled ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.notificationEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-foreground">
                    {settings.notificationEnabled ? '켜짐' : '꺼짐'}
                  </span>
                </div>

                {/* Notification Type */}
                {settings.notificationEnabled && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                      <input
                        type="radio"
                        name="notificationType"
                        value="browser"
                        checked={settings.notificationType === 'browser'}
                        onChange={() => handleNotificationTypeChange('browser')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-foreground">브라우저 알림</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                      <input
                        type="radio"
                        name="notificationType"
                        value="email"
                        checked={settings.notificationType === 'email'}
                        onChange={() => handleNotificationTypeChange('email')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-foreground">이메일 알림</span>
                    </label>

                    {/* Email Input */}
                    {settings.notificationType === 'email' && (
                      <div className="mt-4 p-4 bg-secondary rounded-lg">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          이메일 주소
                        </label>
                        <input
                          type="email"
                          value={settings.emailAddress}
                          onChange={handleEmailChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 <strong>팁:</strong> 설정은 이 기기의 브라우저에 저장돼요. 다른 기기에서는 다시 설정해야 해요.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={() => setLocation('/')}
              className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              저장
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
