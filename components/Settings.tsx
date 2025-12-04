
import React, { useState, useRef, useEffect } from 'react';
import { LibrarySettings, DashboardStats } from '../types';
import { 
    Save, Upload, Clock, Settings as SettingsIcon, AlertTriangle, 
    LayoutDashboard, Zap, Edit3, GraduationCap, BookOpen, FileText, 
    Users, Repeat, CheckCircle, Shield, Library, Monitor, UserCircle, 
    Copy, Sliders, Tag, Copyright, Info, Database, RefreshCw, Check, 
    GitMerge, Lock, FileInput, FileOutput, Trash2, Globe, Loader2, RotateCcw, X,
    Activity, Layers, Eye, Sparkles
} from 'lucide-react';

interface SettingsProps {
  settings: LibrarySettings;
  onUpdateSettings: (settings: LibrarySettings) => void;
  onBackup: () => void;
  onRestore: (file: File) => void;
  stats?: DashboardStats;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onBackup, onRestore, stats }) => {
  const [localSettings, setLocalSettings] = useState<LibrarySettings>(JSON.parse(JSON.stringify(settings)));
  const [activeRoleTab, setActiveRoleTab] = useState('student');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
      setHasChanges(isChanged);
  }, [localSettings, settings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onRestore(e.target.files[0]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              const result = event.target?.result;
              if (result && typeof result === 'string') {
                  updateNested('logo', result);
                  showNotification('تم تحميل الشعار بنجاح (تذكر حفظ التغييرات)', 'success');
              }
          };
          reader.readAsDataURL(file);
          // Reset value so same file can be uploaded again if needed
          e.target.value = '';
      }
  };

  const validate = (): boolean => {
      if (!localSettings.name || !localSettings.name.trim()) return false;
      if (!localSettings.institution || !localSettings.institution.trim()) return false;
      return true;
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveAll = async () => {
      if (!hasChanges) return;
      
      if (!validate()) {
          showNotification('يرجى ملء جميع الحقول المطلوبة', 'warning');
          return;
      }

      setIsSaving(true);
      
      // Simulate network
      setTimeout(() => {
          onUpdateSettings(localSettings);
          showNotification('تم حفظ جميع التغييرات بنجاح', 'success');
          setIsSaving(false);
          setHasChanges(false);
      }, 800);
  };

  const handleReset = () => {
      if (window.confirm('هل أنت متأكد من استعادة الإعدادات الأصلية؟ ستفقد التغييرات غير المحفوظة.')) {
          setLocalSettings(JSON.parse(JSON.stringify(settings)));
      }
  };

  const updateNested = (path: string, value: any) => {
      set