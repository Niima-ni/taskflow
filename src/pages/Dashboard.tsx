import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects'; // Import du hook
import HeaderMUI from '../components/HeaderMUI';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  // Utilisation du hook personnalisé pour récupérer l'état et les fonctions
 const { 
  projects, 
  columns, 
  loading, 
  error, 
  addProject
} = useProjects();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);


  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authUser?.name}
        onLogout={() => dispatch(logout())}
      />


      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <>
                {error && <div className={styles.error}>{error}</div>}

                <button
                  className={styles.addBtn}
                  onClick={() => setShowForm(true)}
                >
                  + Nouveau projet
                </button>
              </>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>

          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}