<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>리듬메이트 - 자취 초년생 AI 라이프 튜터</title>
    
    <!-- Tailwind CSS (스타일링) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React & ReactDOM (UI 라이브러리) -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    
    <!-- Babel (브라우저에서 JSX 코드를 읽을 수 있게 변환) -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <style>
        /* 기본 폰트 설정 */
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
            background-color: #f1f5f9;
        }
        
        /* 모바일 느낌의 스크롤바 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        
        /* 등장 애니메이션 */
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in-up 0.4s ease-out forwards;
        }
    </style>
</head>
<body>
    <!-- React 앱이 렌더링될 공간 -->
    <div id="root"></div>

    <!-- React 컴포넌트 코드 -->
    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- 아이콘 컴포넌트 ---
        const CheckCircleIcon = ({ active }) => (
            <svg className={`w-6 h-6 ${active ? 'text-teal-500' : 'text-gray-300'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        );
        const TrashIcon = () => (
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        );
        const WalletIcon = () => (
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
        );

        // --- 메인 앱 컴포넌트 ---
        function App() {
            // 상태 관리
            const [tasks, setTasks] = useState([
                { id: 1, title: '기상 직후 기지개 켜기', time: '1분', type: 'rhythm', done: true },
                { id: 2, title: '책상 위 머그컵 치우기', time: '3분', type: 'chore', done: false },
                { id: 3, title: '아침 영양제 챙겨먹기', time: '1분', type: 'health', done: false }
            ]);

            const aiSuggestions = [
                { id: 101, title: '점심 식사 후 가벼운 환기', time: '5분', message: '오후 1시네요! 실내 공기를 5분만 바꿔볼까요? 집중력이 올라갈 거예요 😊' },
                { id: 102, title: '물 한 잔 마시기', time: '1분', message: '오늘 수분 섭취가 조금 부족해 보여요. 물 한 잔 마시는 건 어떨까요?' }
            ];
            
            const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
            const [feedbackMsg, setFeedbackMsg] = useState("");
            const [toastVisible, setToastVisible] = useState(false);

            // 핸들러 함수
            const toggleTask = (id) => {
                setTasks(tasks.map(task => {
                    if (task.id === id) {
                        const isDone = !task.done;
                        if (isDone) showToast("잘하셨어요! 작은 성공이 모여 큰 변화를 만듭니다 🎉");
                        return { ...task, done: isDone };
                    }
                    return task;
                }));
            };

            const acceptSuggestion = () => {
                const suggestion = aiSuggestions[currentSuggestionIndex];
                setTasks([...tasks, { id: suggestion.id, title: suggestion.title, time: suggestion.time, type: 'rhythm', done: false }]);
                showToast("새로운 목표가 추가되었습니다. 천천히 해보아요!");
                nextSuggestion();
            };

            const declineSuggestion = () => {
                showToast("괜찮아요! 다음에 더 알맞은 목표를 찾아볼게요 🌿");
                nextSuggestion();
            };

            const nextSuggestion = () => {
                setCurrentSuggestionIndex((prev) => (prev + 1) % aiSuggestions.length);
            };

            const showToast = (msg) => {
                setFeedbackMsg(msg);
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 3000);
            };

            return (
                <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative pb-20">
                    {/* 상단 헤더 */}
                    <header className="px-6 pt-10 pb-4 bg-teal-500 rounded-b-3xl shadow-sm text-white sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-xl font-bold tracking-tight">RhythmMate</h1>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                🏠
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-teal-100 text-sm">1주차: 적응기</span>
                            <span className="text-xl font-medium mt-1">오늘도 무리 없이,<br/>나만의 리듬을 찾아가요.</span>
                        </div>
                    </header>

                    <main className="p-5 space-y-6">
                        
                        {/* AI 큐레이션 카드 */}
                        <section className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-600 rounded-full">AI 제안</span>
                                <h2 className="text-sm font-semibold text-gray-700">지금 딱 하기 좋은 일</h2>
                            </div>
                            <div className="bg-white border border-purple-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                                <p className="text-gray-800 text-sm leading-relaxed mb-4">
                                    "{aiSuggestions[currentSuggestionIndex].message}"
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">예상 소요시간: {aiSuggestions[currentSuggestionIndex].time}</span>
                                    <div className="space-x-2">
                                        <button onClick={declineSuggestion} className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                            건너뛰기
                                        </button>
                                        <button onClick={acceptSuggestion} className="px-3 py-1.5 text-xs font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition shadow-sm">
                                            수락하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 ml-1">* 제안을 거부하더라도 페널티는 전혀 없습니다.</p>
                        </section>

                        {/* 미세 목표 리스트 */}
                        <section className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                            <h2 className="text-lg font-bold text-gray-800 mb-3">오늘의 미세 목표</h2>
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <div key={task.id} 
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border ${task.done ? 'bg-teal-50 border-teal-100' : 'bg-white border-gray-100 shadow-sm hover:border-teal-300'}`}>
                                        <div className="flex items-center space-x-3">
                                            <CheckCircleIcon active={task.done} />
                                            <span className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded-md">
                                            {task.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-4">
                            {/* 생활 캘린더 위젯 */}
                            <section className="bg-orange-50 border border-orange-100 p-4 rounded-2xl animate-fade-in" style={{animationDelay: '0.3s'}}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <TrashIcon />
                                    <h2 className="text-sm font-bold text-orange-700">생활 캘린더</h2>
                                </div>
                                <p className="text-xs text-orange-600/80 mb-2">내일(목)은 <strong>재활용 쓰레기</strong> 버리는 날이에요.</p>
                                <button className="w-full py-1.5 mt-1 text-xs font-semibold bg-white text-orange-600 border border-orange-200 rounded-lg shadow-sm">
                                    5분 정리 시작하기
                                </button>
                            </section>

                            {/* 미니 가계부 위젯 */}
                            <section className="bg-blue-50 border border-blue-100 p-4 rounded-2xl animate-fade-in" style={{animationDelay: '0.4s'}}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <WalletIcon />
                                    <h2 className="text-sm font-bold text-blue-700">이번 주 가계부</h2>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-1.5 mb-2 mt-3">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '70%'}}></div>
                                </div>
                                <p className="text-xs text-blue-700 font-medium mb-1">생활비 3만원 남음</p>
                                <p className="text-[10px] text-blue-600/80 leading-snug mt-2 bg-white/60 p-1.5 rounded">
                                    💡 배달 1회 줄이면 평소 사고 싶던 <strong>룸 스프레이</strong>를 살 수 있어요!
                                </p>
                            </section>
                        </div>

                    </main>

                    {/* 토스트 알림 */}
                    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-gray-800 text-white text-sm py-3 px-4 rounded-xl shadow-lg transition-all duration-300 z-50 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="flex items-center space-x-2">
                            <span>✨</span>
                            <p>{feedbackMsg}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 앱 렌더링
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>