# Analisis Pemrograman Sistem Interaktif
**GrowBussiness Frontend Application**

---

## note (subject)
replay subject (menyimpan riwayat terbatas)
- log, aktivitas, pesan chat terakhir
cons: memori

## 📋 Ringkasan Eksekutif

Aplikasi GrowBussiness Frontend telah menerapkan **beberapa konsep** dari Pemrograman Sistem Interaktif, namun **belum menerapkan semuanya secara optimal**. Dokumen ini menganalisis tingkat implementasi masing-masing paradigma.

---

## 1. ✅ ASYNCHRONOUS PROGRAMMING (Pemrograman Asinkronus)

**Status**: ✅ SUDAH DIIMPLEMENTASIKAN

### Temuan:
Aplikasi sudah menggunakan pola asinkronus secara ekstensif:

#### A. HTTP Client dengan Axios (api.js)
```
- axios.create() dengan interceptors
- Promise-based API calls
- Error handling dengan Promise.reject()
- Request interceptor untuk auto-attach token
```

#### B. Async/Await Pattern
**Ditemukan di:**
- `ForumPage.jsx`: fetchCategory(), fetchForum(), handleShowPopup()
- `AiChatPage.jsx`: fetchSessions(), handleSelectSession(), handleSendMessage()
- `ForumDetailPage.jsx`: fetchForumDetail(), handleSubmitComment()
- `SchedulePage.jsx`: fetchSchedule(), handleEditScheduleSubmit()
- `AuthContext.jsx`: useEffect untuk initialize auth state

#### C. State Updates Asinkronus
- Loading states: `setIsLoading()`, `setLoading()`
- Delayed state updates dalam try-catch blocks

**Contoh Implementasi:**
```javascript
const handleSendMessage = async () => {
    setMessages(prev => [...prev, tempUserMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    
    try {
        const response = await usersAPI.sendAiChat({...});
        setMessages(prev => [...prev, data.messages[1]]);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
```

**Kesimpulan**: ✅ Asynchronous sudah diterapkan dengan baik

---

## 2. 🟡 OBSERVER PATTERN

**Status**: 🟡 SEBAGIAN DIIMPLEMENTASIKAN

### Temuan:

#### A. React Context API (AuthContext.jsx) - Observer-like
```javascript
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```
**Analisis**: Ini mirip Observer pattern dimana:
- Provider adalah "Subject"
- useAuth hook adalah "Observer"
- Component subscribers mendapat notifikasi saat perubahan

#### B. React useEffect - Implicit Observer
Setiap useEffect adalah form observer yang "watch" dependencies:
```javascript
useEffect(() => {
    fetchForumDetail();
}, [id]); // Observer ketika 'id' berubah
```

### Yang TIDAK diimplementasikan:
❌ Explicit Observer Pattern dengan:
- `subscribe()` / `unsubscribe()` methods
- `notify()` method untuk semua listeners
- Centralized event observer system

**Contoh yang TIDAK ada:**
```javascript
// TIDAK ADA:
const eventObserver = {
    subscribe: (event, callback) => {},
    unsubscribe: (event, callback) => {},
    notify: (event, data) => {}
};
```

**Kesimpulan**: 🟡 Observer patterns ada secara implisit via React Context & Hooks, tapi tidak eksplisit

---

## 3. 🟡 REACTIVE PROGRAMMING

**Status**: 🟡 SEBAGIAN DIIMPLEMENTASIKAN (React level)

### Temuan:

#### A. React Reactivity (Built-in)
- State management dengan `useState()`
- Automatic re-renders saat state berubah
- Hooks untuk reactive behavior

#### B. Reactive Patterns yang Ada:
1. **State dependency tracking**:
   ```javascript
   useEffect(() => {
       chatEndRef.current?.scrollIntoView();
   }, [messages]); // Reactive: run when messages change
   ```

2. **Poll-based Reactivity** (SchedulePage.jsx):
   ```javascript
   useEffect(() => {
       const interval = setInterval(() => {
           fetchSchedule(); // Fetch setiap 5 detik
       }, 5000);
       return () => clearInterval(interval);
   }, []);
   ```

3. **Derived state dengan useMemo**:
   ```javascript
   const ongoingSchedule = schedule.filter(
       (item) => item.current_status === "ongoing"
   ); // Reactive filtering
   ```

### Yang TIDAK diimplementasikan:
❌ True Reactive Programming Libraries:
- **RxJS** (Reactive Extensions) - tidak digunakan
- **Stream-based reactivity** - tidak ada
- **Operators** seperti `map()`, `filter()`, `switchMap()` pada streams
- **Observables** - tidak ada

**Contoh yang TIDAK ada:**
```javascript
// TIDAK ADA:
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

const searchSubject = new Subject();
searchSubject.pipe(
    debounceTime(300),
    switchMap(query => apiClient.get(`/search?q=${query}`))
).subscribe(result => setSearchResults(result));
```

**Kesimpulan**: 🟡 React built-in reactivity ada, tapi bukan True Reactive Programming

---

## 4. 🟡 EVENT-DRIVEN PROGRAMMING

**Status**: 🟡 SEBAGIAN DIIMPLEMENTASIKAN (DOM level)

### Temuan:

#### A. Event Handlers (DOM Events) - Ada
```javascript
// Header.jsx
const handleLogout = () => {
    logout();
    navigate('/');
};
<button onClick={handleLogout}>Logout</button>

// ForumPage.jsx
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({...}));
};
<input name="title" onChange={handleInputChange} />
```

#### B. Form Events
- `onChange` events pada input/textarea
- `onSubmit` events pada forms
- `onClick` events pada buttons

#### C. Custom Event Handlers
```javascript
const handleDetailForum = (id) => {
    navigate(`/forum/${id}`);
};
const handleNewChat = () => {
    setMessages([]);
};
```

### Yang TIDAK diimplementasikan:
❌ Centralized Event System:
- **EventEmitter** pattern - tidak ada
- **Event dispatcher/bus** - tidak ada
- **Global event listener** - tidak ada
- **Event bubbling management** - hanya browser default

**Contoh yang TIDAK ada:**
```javascript
// TIDAK ADA:
class EventEmitter {
    emit(eventName, data) {}
    on(eventName, callback) {}
    off(eventName, callback) {}
}

const eventBus = new EventEmitter();
eventBus.on('userLoggedIn', (user) => {});
eventBus.emit('userLoggedIn', userData);
```

**Kesimpulan**: 🟡 Event handlers ada tapi hanya DOM-level, tidak ada Event-Driven Architecture

---

## 5. ❌ PUB/SUBSCRIBE PATTERN

**Status**: ❌ TIDAK DIIMPLEMENTASIKAN (atau sangat minimal)

### Temuan:

#### A. Context API sebagai Pseudo Pub/Sub
```javascript
// AuthContext.jsx
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```
**Catatan**: Ini BUKAN true Pub/Sub, melainkan:
- State sharing melalui Provider
- Subscribers adalah components yang menggunakan `useAuth()`
- Terbatas pada React Context

#### B. API Response Handling
```javascript
// Tidak ada publisher/subscriber explicit
const response = await usersAPI.getForumCategory();
setCategory(response.data.data); // Direct assignment
```

### Yang TIDAK diimplementasikan:
❌ True Pub/Sub Pattern:
- **Event bus** dengan `publish()` dan `subscribe()`
- **Topic-based messaging** - tidak ada
- **Message queue** - tidak ada
- **Decoupled publishers and subscribers** - tidak ada

**Contoh yang TIDAK ada:**
```javascript
// TIDAK ADA - True Pub/Sub:
const pubSub = {
    topics: {},
    
    subscribe: (topic, callback) => {
        if (!pubSub.topics[topic]) pubSub.topics[topic] = [];
        pubSub.topics[topic].push(callback);
    },
    
    publish: (topic, data) => {
        if (pubSub.topics[topic]) {
            pubSub.topics[topic].forEach(cb => cb(data));
        }
    }
};

// Usage:
pubSub.subscribe('forum:updated', (forumData) => {
    setForum(forumData);
});

pubSub.publish('forum:updated', newForumData);
```

**Kesimpulan**: ❌ Pub/Sub Pattern tidak diimplementasikan

---

## 📊 RINGKASAN IMPLEMENTASI

| Konsep | Status | Tingkat | Keterangan |
|--------|--------|--------|-----------|
| **Asynchronous** | ✅ | 90% | Axios, async/await, Promises |
| **Observer Pattern** | 🟡 | 40% | Context API implisit, bukan explicit |
| **Reactive Programming** | 🟡 | 50% | React reactivity, tidak ada RxJS |
| **Event-Driven** | 🟡 | 30% | DOM events saja, tidak ada architecture |
| **Pub/Subscribe** | ❌ | 0% | Tidak ada implementasi |

---

## 🔧 REKOMENDASI PERBAIKAN

### **Priority 1: URGENT** - Pub/Subscribe Pattern
Implementasikan centralized event bus untuk decouple components:
```javascript
// utils/eventBus.js
class EventBus {
    constructor() {
        this.events = {};
    }
    
    subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        
        return () => {
            this.events[event] = 
                this.events[event].filter(cb => cb !== callback);
        };
    }
    
    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(data));
        }
    }
}

export default new EventBus();
```

**Keuntungan:**
- Decoupled event handling
- Reusable event communication
- Easier to test dan maintain

---

### **Priority 2: HIGH** - Reactive Programming dengan RxJS
Install dan gunakan RxJS untuk true reactive patterns:

```bash
npm install rxjs
```

**Contoh implementasi:**
```javascript
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

const searchSubject = new Subject();

searchSubject.pipe(
    debounceTime(300),
    switchMap(query => {
        return fromPromise(publicApi.getForum(query));
    })
).subscribe(
    result => setForum(result.data),
    error => console.error(error)
);
```

---

### **Priority 3: MEDIUM** - Explicit Observer Pattern
Implementasikan centralized observer untuk state management:

```javascript
// utils/Observer.js
class StateObserver {
    constructor(initialState) {
        this.state = initialState;
        this.observers = [];
    }
    
    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(cb => cb !== callback);
        };
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.observers.forEach(cb => cb(this.state));
    }
    
    getState() {
        return this.state;
    }
}
```

---

### **Priority 4: MEDIUM** - Event-Driven Architecture
Buat centralized event dispatcher:

```javascript
// utils/EventDispatcher.js
class EventDispatcher {
    constructor() {
        this.listeners = {};
    }
    
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    
    off(event, callback) {
        this.listeners[event] = 
            this.listeners[event]?.filter(cb => cb !== callback);
    }
    
    dispatch(event, detail) {
        this.listeners[event]?.forEach(callback => {
            callback(detail);
        });
    }
}
```

---

## 📝 KESIMPULAN

**Aplikasi GrowBussiness Frontend SUDAH menerapkan:**
✅ Asynchronous Programming (90%)
- Menggunakan axios dan async/await dengan baik

**Aplikasi GrowBussiness Frontend SEBAGIAN menerapkan:**
🟡 Observer Pattern (40%) - Implicit via React Context
🟡 Reactive Programming (50%) - Via React hooks, bukan RxJS
🟡 Event-Driven (30%) - DOM events saja, tidak ada architecture

**Aplikasi GrowBussiness Frontend BELUM menerapkan:**
❌ Pub/Subscribe Pattern (0%)
- Tidak ada explicit publish/subscribe mechanism

---

## 🎯 NEXT STEPS

1. **Implementasikan Event Bus** untuk Pub/Sub pattern
2. **Tambahkan RxJS** untuk true reactive programming
3. **Centralize Observer** dengan dedicated observer pattern
4. **Refactor Event Handling** ke event-driven architecture
5. **Add Documentation** untuk interactive systems patterns

---

**Generated**: May 19, 2026
**Application**: GrowBussiness Frontend
**Analysis Type**: Interactive Systems Programming Audit
