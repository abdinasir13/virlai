import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

// Icons
const Download = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const Settings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.4-6.4l-4.2 4.2m-6.4 0L3.6 3.6m16.8 16.8l-4.2-4.2m-6.4 0l-4.2 4.2"/></svg>;
const Server = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
const MessageSquare = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const Zap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Flame = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const Trophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>;
const Laugh = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const AlertCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const Edit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const Sparkles = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11"/></svg>;
const TrendingUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/></svg>;
const BarChart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
const Search = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const Filter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const CheckCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const Loader = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const X = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [activeTab, setActiveTab] = useState('clips');
  const [moments, setMoments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [serverConnected, setServerConnected] = useState(false);
  const [previewMoment, setPreviewMoment] = useState(null);
  const [editCommand, setEditCommand] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClips, setSelectedClips] = useState([]);
  
  const [learningStats, setLearningStats] = useState(null);
  const [learningLoading, setLearningLoading] = useState(false);
  
  const [config, setConfig] = useState({
    viralityThreshold: 70,
    clipDuration: 30,
    bufferBefore: 10,
  });
  
  const wsRef = useRef(null);
  const logRef = useRef(null);
  const videoRef = useRef(null);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      id: Date.now() + Math.random(),
      timestamp,
      message,
      type
    }, ...prev].slice(0, 100));
  }, []);

  const fetchLearningStats = useCallback(async () => {
    setLearningLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/learning/stats`);
      if (response.ok) {
        const data = await response.json();
        setLearningStats(data);
        addLog('📊 Learning stats updated', 'success');
      }
    } catch (error) {
      addLog(`Error fetching learning stats: ${error.message}`, 'error');
    } finally {
      setLearningLoading(false);
    }
  }, [API_URL, addLog]);

  useEffect(() => {
    wsRef.current = io(API_URL);
    
    wsRef.current.on('connect', () => {
      setServerConnected(true);
      addLog('✅ Connected to backend server', 'success');
    });
    
    wsRef.current.on('disconnect', () => {
      setServerConnected(false);
      addLog('❌ Disconnected from server', 'error');
    });
    
    wsRef.current.on('log', (data) => {
      addLog(data.message, data.type);
    });
    
    wsRef.current.on('moment_detected', (moment) => {
      setMoments(prev => [{ ...moment, status: 'processing', feedback: null }, ...prev].slice(0, 100));
      addLog(`🎬 Moment detected: Score ${moment.virality_score}`, 'success');
    });
    
    wsRef.current.on('moment_ready', (data) => {
      setMoments(prev => 
        prev.map(m => m.id === data.id ? { ...m, status: 'ready', clip_path: data.clip_path } : m)
      );
      addLog(`📹 Clip ready: ${data.id}`, 'success');
    });

    return () => {
      if (wsRef.current) wsRef.current.disconnect();
    };
  }, [API_URL, addLog]);

  useEffect(() => {
    if (activeTab === 'learning' && serverConnected) {
      fetchLearningStats();
    }
  }, [activeTab, serverConnected, fetchLearningStats]);

  const filteredAndSortedMoments = moments
    .filter(m => {
      const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
      const matchesSearch = !searchTerm || 
        (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'virality') {
        return (b.virality_score || 0) - (a.virality_score || 0);
      } else if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  const getCategoryIcon = (category) => {
    const icons = { funny: Laugh, hype: Flame, fail: AlertCircle, win: Trophy, clutch: Zap };
    return icons[category] || Zap;
  };

  const getCategoryColor = (category) => {
    const colors = { funny: 'bg-yellow-500', hype: 'bg-orange-500', fail: 'bg-red-500', win: 'bg-green-500', clutch: 'bg-purple-500' };
    return colors[category] || 'bg-gray-500';
  };

  const getViralityColor = (score) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 80) return 'text-orange-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const previewClip = (moment) => {
    setPreviewMoment(moment);
    setEditCommand('');
    setEditError('');
    setEditSuccess('');
    addLog(`👁️ Previewing: ${moment.id}`, 'info');
  };

  const closePreview = () => {
    setPreviewMoment(null);
    setEditCommand('');
    setEditError('');
    setEditSuccess('');
    setIsEditing(false);
  };

  const editClip = async (momentId, command) => {
    if (!serverConnected || !command.trim()) return;
    
    setIsEditing(true);
    setEditError('');
    setEditSuccess('');
    addLog(`✏️ Editing: "${command}"`, 'info');
    
    try {
      const response = await fetch(`${API_URL}/api/clips/${momentId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addLog(`✨ Edit complete! ${data.operations.join(', ')}`, 'success');
        setEditSuccess(`✨ Edit successful! Applied: ${data.operations.join(', ')}`);
        
        if (videoRef.current) {
          videoRef.current.src = `${API_URL}/api/clips/${data.clip_id}/stream?t=${Date.now()}`;
          videoRef.current.load();
        }
        
        setPreviewMoment(prev => ({
          ...prev,
          id: data.clip_id,
          title: `${prev.title} (Edited)`,
          edited: true
        }));
        setEditCommand('');
        
        setTimeout(() => setEditSuccess(''), 3000);
      } else {
        const errorMsg = data.error || 'Unknown error';
        addLog(`❌ ${errorMsg}`, 'error');
        setEditError(`Error: ${errorMsg}${data.suggestion ? ' - ' + data.suggestion : ''}`);
      }
    } catch (error) {
      const errorMsg = error.message;
      addLog(`❌ Error: ${errorMsg}`, 'error');
      setEditError(`Network error: ${errorMsg}`);
    } finally {
      setIsEditing(false);
    }
  };

  const submitFeedback = async (momentId, feedbackType) => {
    if (!serverConnected) return;
    
    try {
      await fetch(`${API_URL}/api/clips/${momentId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: feedbackType })
      });
      
      setMoments(prev => 
        prev.map(m => m.id === momentId ? { ...m, feedback: feedbackType } : m)
      );
      addLog(`👍 Feedback recorded: ${feedbackType}`, 'success');
      closePreview();
    } catch (error) {
      addLog(`Error submitting feedback: ${error.message}`, 'error');
    }
  };

  const downloadClip = (moment) => {
    if (serverConnected && moment.clip_path) {
      window.open(`${API_URL}/api/clips/${moment.id}/download`, '_blank');
      addLog(`⬇️ Downloading: ${moment.id}`, 'info');
    }
  };

  const toggleClipSelection = (momentId) => {
    setSelectedClips(prev => 
      prev.includes(momentId) 
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    );
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* PREVIEW MODAL */}
        {previewMoment && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closePreview}>
            <div className="bg-slate-800 rounded-xl max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{previewMoment.title || 'Viral Moment'}</h3>
                    {previewMoment.edited && (
                      <span className="text-sm text-green-400">✨ Edited with AI</span>
                    )}
                    {previewMoment.feedback && (
                      <span className="text-sm text-purple-400 ml-2">• Feedback: {previewMoment.feedback}</span>
                    )}
                  </div>
                  <button onClick={closePreview} className="text-slate-400 hover:text-white">
                    <X />
                  </button>
                </div>
                
                <div className="bg-black rounded-lg mb-6 relative">
                  <video 
                    ref={videoRef}
                    controls 
                    autoPlay
                    preload="auto"
                    playsInline
                    className="w-full rounded-lg"
                    src={`${API_URL}/api/clips/${previewMoment.id}/stream`}
                    style={{ maxHeight: '60vh' }}
                  >
                    Your browser does not support video playback.
                  </video>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-3 py-1 rounded text-sm">
                    Score: {previewMoment.virality_score || 0}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs mb-1">Virality</div>
                    <div className={`text-2xl font-bold ${getViralityColor(previewMoment.virality_score || 0)}`}>
                      {previewMoment.virality_score || 0}
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs mb-1">Category</div>
                    <div className="text-lg font-semibold capitalize">{previewMoment.category || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs mb-1">Time</div>
                    <div className="text-sm">{new Date(previewMoment.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs mb-1">Status</div>
                    <div className={`text-sm font-bold ${previewMoment.status === 'ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {previewMoment.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles />
                    <h4 className="text-lg font-bold">Edit with AI</h4>
                  </div>
                  
                  {editError && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-200">
                      {editError}
                    </div>
                  )}
                  
                  {editSuccess && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-sm text-green-200 flex items-center gap-2">
                      <CheckCircle /> {editSuccess}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={editCommand}
                      onChange={(e) => setEditCommand(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isEditing && editClip(previewMoment.id, editCommand)}
                      placeholder='Try: "make vertical and add subtitles"'
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      disabled={isEditing}
                    />
                    <button 
                      onClick={() => editClip(previewMoment.id, editCommand)}
                      disabled={isEditing || !editCommand.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all">
                      {isEditing ? (
                        <><Loader /> Editing...</>
                      ) : (
                        <><Edit /> Edit</>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2">Quick actions:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'make vertical',
                      'add subtitles',
                      'trim filler',
                      'speed up 1.5x',
                      'add hook',
                      'make vertical and add subtitles'
                    ].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => setEditCommand(cmd)}
                        disabled={isEditing}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-xs text-left transition-all">
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button onClick={() => downloadClip(previewMoment)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg py-3 font-semibold flex items-center justify-center gap-2">
                    <Download />
                    Download Clip
                  </button>
                  <button onClick={closePreview}
                    className="px-8 bg-slate-600 hover:bg-slate-500 rounded-lg py-3 font-semibold">
                    Close
                  </button>
                </div>

                {!previewMoment.feedback && (
                  <div className="border-t border-slate-600 pt-4">
                    <div className="text-sm text-slate-400 mb-3">Rate this clip:</div>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => submitFeedback(previewMoment.id, 'banger')}
                        className="bg-green-600 hover:bg-green-700 rounded-lg py-3 text-sm font-semibold">
                        🔥 Banger
                      </button>
                      <button onClick={() => submitFeedback(previewMoment.id, 'good')}
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg py-3 text-sm font-semibold">
                        👍 Good
                      </button>
                      <button onClick={() => submitFeedback(previewMoment.id, 'mid')}
                        className="bg-yellow-600 hover:bg-yellow-700 rounded-lg py-3 text-sm font-semibold">
                        😐 Mid
                      </button>
                      <button onClick={() => submitFeedback(previewMoment.id, 'boring')}
                        className="bg-red-600 hover:bg-red-700 rounded-lg py-3 text-sm font-semibold">
                        💤 Skip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Viral Moment Detector
              </h1>
              <p className="text-slate-400 mt-2">AI-powered clip detection & editing</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                serverConnected ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
              }`}>
                <Server />
                <span className="text-sm">{serverConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <button onClick={() => setShowConfig(!showConfig)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600">
                <Settings />
                Config
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('clips')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'clips'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}>
              <Zap className="w-4 h-4 inline mr-2" />
              Clips
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'learning'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}>
              <BarChart className="w-4 h-4 inline mr-2" />
              Learning Stats
            </button>
          </div>

          {showConfig && (
            <div className="mb-4 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
