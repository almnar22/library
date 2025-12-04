
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Catalog } from './components/Catalog';
import { Lending } from './components/Lending';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { Specializations } from './components/Specializations';
import { Settings } from './components/Settings';
import { Assistant } from './components/Assistant';
import { Page, Book, Loan, User, LibrarySettings } from './types';

// Mock Initial Data
const INITIAL_BOOKS: Book[] = [
  { 
    id: '1624', code: '1624', inventoryNumber: '0.00', 
    title: 'إدارة الأعمال وإدارة المستشفيات الجزء الأول', author: 'محمد عبد المنعم شعيب', 
    specialization: 'إدارة صحية', department: 'العلوم الصحية', 
    cabinet: 'F9', bookShelfNumber: '1', shelfOrder: 'رف 1', 
    copies: 2, editionYear: '2013', entryDate: '2024-02-10', 
    remainingCopies: 2, parts: 0, price: 0.00 
  },
  { 
    id: '1625', code: '1625', inventoryNumber: '0.00', 
    title: 'الإدارة الصحية وإدارة المستشفيات الجزء الثاني', author: 'محمد عبد المنعم شعيب', 
    specialization: 'إدارة صحية', department: 'العلوم الصحية', 
    cabinet: 'F9', bookShelfNumber: '3', shelfOrder: 'رف 1', 
    copies: 2, editionYear: '2014', entryDate: '2024-02-10', 
    remainingCopies: 1, parts: 0, price: 0.00 
  },
  { 
    id: '1626', code: '1626', inventoryNumber: '0.00', 
    title: 'قاموس المصطلحات الطبية الموحد', author: 'د. أحمد شفيق', 
    specialization: 'قواميس ومعاجم', department: 'العلوم الصحية', 
    cabinet: 'D1', bookShelfNumber: '5', shelfOrder: 'رف 2', 
    copies: 5, editionYear: '2020', entryDate: '2024-01-15', 
    remainingCopies: 5, parts: 1, price: 150.00 
  },
  { 
    id: '1627', code: '1627', inventoryNumber: '0.00', 
    title: 'مجلة البحوث الصحية - العدد 45', author: 'هيئة التحرير', 
    specialization: 'دوريات علمية', department: 'الدوريات', 
    cabinet: 'M1', bookShelfNumber: '12', shelfOrder: 'رف 3', 
    copies: 10, editionYear: '2024', entryDate: '2024-03-01', 
    remainingCopies: 10, parts: 1, price: 50.00 
  },
];

const INITIAL_USERS: User[] = [
    {
        id: 'admin', name: 'المسؤول الرئيسي', email: 'admin@library.edu', password: 'admin',
        role: 'admin', status: 'active', joinDate: '2023-01-01', department: 'الإدارة', visits: 142
    },
    {
        id: '1001', name: 'أحمد محمد', email: 'student1@uni.edu', password: '2002',
        role: 'student', status: 'active', joinDate: '2023-09-01', department: 'علوم الحاسوب', visits: 15
    },
    {
        id: '2001', name: 'د. سارة علي', email: 'dr.sara@uni.edu', password: '4002',
        role: 'professor', status: 'active', joinDate: '2022-01-15', department: 'العلوم الصحية', visits: 45
    }
];

const INITIAL_LOANS: Loan[] = [];

const DEFAULT_SETTINGS: LibrarySettings = {
    name: 'المكتبة الجامعية المركزية',
    institution: 'جامعة القاهرة',
    email: 'library@university.edu.eg',
    phone: '02-12345678',
    copyrightText: 'جميع الحقوق محفوظة © 2024',
    backupIntervalDays: 7,
    lastBackupDate: null,
    dashboardMode: 'auto',
    manualStats: { students: 0, books: 0, journals: 0, professors: 0, borrowed: 0, available: 0 },
    visibleStats: { students: true, books: true, journals: true, professors: true, borrowed: true, available: true },
    privacyLevel: 'medium',
    securityOptions: { exportRestricted: false, encrypted: false, activityLog: true, maintenanceMode: false },
    permissions: {
        student: { borrow: true, search: true, digital: true },
        professor: { borrow: true, search: true, digital: true },
        staff: { borrow: true, search: true, digital: true },
        admin: { borrow: true, search: true, digital: true }
    }
};

function App() {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  
  // Data State with Persistence
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('library_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('library_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('library_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [settings, setSettings] = useState<LibrarySettings>(() => {
    const saved = localStorage.getItem('library_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [specializations, setSpecializations] = useState<string[]>(() => {
     const saved = localStorage.getItem('library_specializations');
     if (saved) return JSON.parse(saved);
     return Array.from(new Set(INITIAL_BOOKS.map(b => b.specialization)));
  });

  const [notifications, setNotifications] = useState<string[]>([]);

  // --- Effects ---
  useEffect(() => { localStorage.setItem('library_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('library_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('library_loans', JSON.stringify(loans)); }, [loans]);
  useEffect(() => { localStorage.setItem('library_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('library_specializations', JSON.stringify(specializations)); }, [specializations]);

  // Update document title
  useEffect(() => {
      document.title = settings.name;
  }, [settings.name]);

  // --- Handlers ---

  const handleLogin = (user: User) => {
    const updatedUser = { ...user, lastLogin: new Date().toISOString(), visits: (user.visits || 0) + 1 };
    
    // Update user in list
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    if (user.role === 'admin') {
        setCurrentPage(Page.DASHBOARD);
        addNotification(`تم تسجيل دخول المسؤول: ${user.name}`);
    } else {
        // Students/Professors go to their lending page or catalog
        setCurrentPage(Page.CATALOG);
        addNotification(`أهلاً بك يا ${user.name}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.LOGIN);
  };

  const addNotification = (msg: string) => {
      setNotifications(prev => [msg, ...prev].slice(0, 5));
  };

  // Book Handlers
  const handleAddBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
    addNotification(`تم إضافة كتاب جديد: ${book.title}`);
    if (!specializations.includes(book.specialization)) {
        setSpecializations(prev => [...prev, book.specialization]);
    }
  };

  const handleAddBooks = (newBooks: Book[]) => {
      setBooks(prev => [...prev, ...newBooks]);
      // Update specializations
      const newSpecs = new Set(specializations);
      newBooks.forEach(b => newSpecs.add(b.specialization));
      setSpecializations(Array.from(newSpecs));
      addNotification(`تم إضافة ${newBooks.length} كتاب بنجاح`);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    addNotification(`تم تحديث بيانات كتاب: ${updatedBook.title}`);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    addNotification('تم حذف الكتاب من السجلات');
  };

  // Loan Handlers
  const handleIssueBook = (bookId: string, userId: string, duration: number, notes?: string) => {
      const book = books.find(b => b.id === bookId);
      const user = users.find(u => u.id === userId);
      
      if (!book || !user) return;
      if (book.remainingCopies <= 0) {
          alert('عذراً، لا توجد نسخ متاحة من هذا الكتاب');
          return;
      }

      const newLoan: Loan = {
          id: Date.now().toString(),
          bookId,
          bookTitle: book.title,
          userId,
          studentName: user.name,
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          originalLocation: {
              cabinet: book.cabinet,
              bookShelfNumber: book.bookShelfNumber,
              shelfOrder: book.shelfOrder
          },
          notes
      };

      setLoans(prev => [...prev, newLoan]);
      
      // Decrease copies
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, remainingCopies: b.remainingCopies - 1 } : b));
      addNotification(`تم إعارة "${book.title}" للطالب ${user.name}`);
  };

  const handleReturnBook = (loanId: string, condition: any, penalty: number, notes: string) => {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      const updatedLoan: Loan = {
          ...loan,
          status: 'returned',
          returnDate: new Date().toISOString(),
          conditionOnReturn: condition,
          penaltyAmount: penalty,
          notes: notes ? (loan.notes ? loan.notes + ' | ' + notes : notes) : loan.notes
      };

      setLoans(prev => prev.map(l => l.id === loanId ? updatedLoan : l));
      
      // Increase copies
      setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, remainingCopies: b.remainingCopies + 1 } : b));
      addNotification(`تم استرجاع "${loan.bookTitle}"`);
  };

  // User Handlers
  const handleAddUser = (user: User) => {
      setUsers(prev => [...prev, user]);
      addNotification(`تم تسجيل مستخدم جديد: ${user.name}`);
  };
  
  const handleAddUsers = (newUsers: User[]) => {
      setUsers(prev => [...prev, ...newUsers]);
      addNotification(`تم إضافة ${newUsers.length} مستخدم بنجاح`);
  };

  const handleUpdateUser = (user: User) => {
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      addNotification(`تم تحديث بيانات المستخدم: ${user.name}`);
  };

  const handleDeleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Specialization Handlers
  const handleAddSpecialization = (name: string) => setSpecializations(prev => [...prev, name]);
  const handleAddSpecializations = (specs: string[]) => setSpecializations(prev => [...prev, ...specs]);
  const handleUpdateSpecialization = (oldName: string, newName: string) => {
      setSpecializations(prev => prev.map(s => s === oldName ? newName : s));
      // Update linked books
      setBooks(prev => prev.map(b => b.specialization === oldName ? { ...b, specialization: newName } : b));
  };
  const handleDeleteSpecialization = (name: string) => {
      setSpecializations(prev => prev.filter(s => s !== name));
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: LibrarySettings) => {
      setSettings(newSettings);
      addNotification('تم حفظ إعدادات النظام بنجاح');
  };

  const handleBackup = () => {
      const data = { books, users, loans, settings, specializations, date: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `library_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSettings(prev => ({ ...prev, lastBackupDate: new Date().toISOString() }));
  };

  const handleRestore = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = JSON.parse(e.target?.result as string);
              if (data.books) setBooks(data.books);
              if (data.users) setUsers(data.users);
              if (data.loans) setLoans(data.loans);
              if (data.settings) setSettings(data.settings);
              if (data.specializations) setSpecializations(data.specializations);
              alert('تم استعادة النسخة الاحتياطية بنجاح');
              window.location.reload();
          } catch (err) {
              alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية');
          }
      };
      reader.readAsText(file);
  };

  // --- Render ---

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} libraryName={settings.name} />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans" dir="rtl">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        settings={settings}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto">
            {currentPage === Page.DASHBOARD && (
                <Dashboard 
                    books={books} 
                    loans={loans} 
                    users={users} 
                    notifications={notifications}
                    settings={settings}
                />
            )}
            
            {currentPage === Page.CATALOG && (
                <Catalog 
                    books={books}
                    onAddBook={handleAddBook}
                    onAddBooks={handleAddBooks}
                    onUpdateBook={handleUpdateBook}
                    onDeleteBook={handleDeleteBook}
                    role={currentUser.role}
                    specializationsList={specializations}
                />
            )}

            {currentPage === Page.LENDING && (
                <Lending 
                    books={books}
                    loans={loans}
                    users={users}
                    currentUser={currentUser}
                    onIssueBook={handleIssueBook}
                    onReturnBook={handleReturnBook}
                />
            )}

            {currentPage === Page.USERS && currentUser.role === 'admin' && (
                <UserManagement 
                    users={users}
                    onAddUser={handleAddUser}
                    onAddUsers={handleAddUsers}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}

            {currentPage === Page.SPECIALIZATIONS && currentUser.role === 'admin' && (
                <Specializations 
                    specializations={specializations}
                    books={books}
                    onAdd={handleAddSpecialization}
                    onAddSpecializations={handleAddSpecializations}
                    onUpdate={handleUpdateSpecialization}
                    onDelete={handleDeleteSpecialization}
                />
            )}

            {currentPage === Page.AI_ASSISTANT && (
                <Assistant books={books} />
            )}

            {currentPage === Page.SETTINGS && currentUser.role === 'admin' && (
                <Settings 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings}
                    onBackup={handleBackup}
                    onRestore={handleRestore}
                    stats={{
                      students: users.filter(u => u.role === 'student').length,
                      books: books.length,
                      journals: books.filter(b => b.specialization.includes('دوريات')).length,
                      professors: users.filter(u => u.role === 'professor' || u.role === 'staff').length,
                      borrowed: loans.filter(l => l.status === 'active' || l.status === 'overdue').length,
                      available: books.reduce((sum, b) => sum + b.remainingCopies, 0)
                    }}
                />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;
