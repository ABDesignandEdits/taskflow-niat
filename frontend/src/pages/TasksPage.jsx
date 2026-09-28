import React, { useState, useEffect, useMemo } from 'react';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  FolderPlus,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TasksPage = ({
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onOpenNewCategory
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [viewMode, setViewMode] = useState('grid');
  const [refreshKey, setRefreshKey] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getTasks(),
          categoryService.getCategories()
        ]);
        setTasks(tasksData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleToggleStatus = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null } : t))
    );
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Error toggling status:', err);
      setRefreshKey(k => k + 1);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await taskService.toggleSubtask(subtaskId);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error('Error toggling subtask:', err);
    }
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category?.name && t.category.name.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    if (statusTab === 'Today') {
      result = result.filter(t => t.due_date === todayStr);
    } else if (statusTab === 'Upcoming') {
      result = result.filter(t => t.due_date && t.due_date > todayStr && t.status !== 'Completed');
    } else if (statusTab === 'Overdue') {
      result = result.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayStr);
    } else if (statusTab === 'Completed') {
      result = result.filter(t => t.status === 'Completed');
    }

    if (selectedCategory) {
      result = result.filter(t => t.category_id === selectedCategory || t.category?.id === selectedCategory);
    }

    if (selectedPriority) {
      result = result.filter(t => t.priority === selectedPriority);
    }

    result.sort((a, b) => {
      if (sortBy === 'due_date') {
        return (a.due_date || '9999') > (b.due_date || '9999') ? 1 : -1;
      }
      if (sortBy === 'priority') {
        const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'estimated_minutes') {
        return (b.estimated_minutes || 0) - (a.estimated_minutes || 0);
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusTab, selectedCategory, selectedPriority, sortBy, todayStr]);

  if (loading) {
    return <LoadingSpinner message="Loading all tasks..." />;
  }

  const statusCounts = {
    All: tasks.length,
    Today: tasks.filter(t => t.due_date === todayStr).length,
    Upcoming: tasks.filter(t => t.due_date && t.due_date > todayStr && t.status !== 'Completed').length,
    Overdue: tasks.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayStr).length,
    Completed: tasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="page-container tasks-page-root">
      <div className="tasks-page-header">
        <div>
          <h1 className="tasks-title">Task Management</h1>
          <p className="tasks-subtitle">Organize, filter, and track all your schoolwork and assignments.</p>
        </div>
        <div className="tasks-header-actions">
          <button
            onClick={onOpenNewCategory}
            className="btn btn-secondary btn-sm"
            title="Create Custom Category"
          >
            <FolderPlus size={16} />
            <span>New Category</span>
          </button>
          <button
            onClick={onOpenNewTask}
            className="btn btn-primary"
            id="tasks-create-btn"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      <div className="status-tabs-container">
        {['All', 'Today', 'Upcoming', 'Overdue', 'Completed'].map((tab) => (
          <button
            key={tab}
            className={`status-tab-btn ${statusTab === tab ? 'status-tab-active' : ''}`}
            onClick={() => setStatusTab(tab)}
          >
            <span>{tab}</span>
            <span className="tab-counter-pill">{statusCounts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="tasks-controls-bar glass-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search tasks, descriptions, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns-group">
          <select
            className="form-select filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="form-select filter-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="form-select filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort Alphabetical</option>
            <option value="created_at">Sort by Date Added</option>
            <option value="estimated_minutes">Sort by Duration</option>
          </select>

          <div className="view-toggle-btns">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description={searchQuery ? `No results found for "${searchQuery}". Try adjusting your search term or filters.` : "You don't have any tasks in this category."}
          actionText="Create New Task"
          onAction={onOpenNewTask}
        />
      ) : (
        <div className={viewMode === 'grid' ? 'tasks-grid-layout' : 'tasks-list-layout'}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleSubtask={handleToggleSubtask}
            />
          ))}
        </div>
      )}

      <style>{`
        .tasks-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tasks-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tasks-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .tasks-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .tasks-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-tabs-container {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
          overflow-x: auto;
        }

        .status-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .status-tab-btn:hover {
          color: var(--text-main);
          background: var(--bg-surface-elevated);
        }

        .status-tab-active {
          color: var(--primary) !important;
          background: var(--primary-light) !important;
          font-weight: 700;
        }

        .tab-counter-pill {
          background: var(--bg-surface-elevated);
          padding: 0.1rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .tasks-controls-bar {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-dim);
        }

        .search-input {
          padding-left: 2.75rem;
        }

        .filter-dropdowns-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-select {
          width: auto;
          min-width: 150px;
          padding: 0.65rem 0.85rem;
          font-size: 0.85rem;
        }

        .view-toggle-btns {
          display: flex;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .view-btn {
          padding: 0.55rem 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .view-btn-active {
          background: var(--primary);
          color: white;
        }

        .tasks-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.25rem;
        }

        .tasks-list-layout {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        @media (max-width: 768px) {
          .tasks-grid-layout {
            grid-template-columns: 1fr;
          }
          .tasks-controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-dropdowns-group {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TasksPage;
