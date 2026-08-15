import { Award, FileText, LayoutDashboard, LogOut, Plus, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/cmsApi'
import type { CmsUser } from '../types/cms'
import { BrandMark } from './BrandMark'

export function CmsAdminLayout({ user, children }: { user: CmsUser; children: ReactNode }) {
  const navigate = useNavigate()
  return <div className="cms-shell">
    <aside className="cms-sidebar">
      <Link to="/admin" className="cms-sidebar__brand"><BrandMark /></Link>
      <p>CMS editorial</p>
      <nav aria-label="Navegação administrativa">
        <NavLink end to="/admin"><LayoutDashboard aria-hidden="true" />Visão geral</NavLink>
        <NavLink to="/admin/artigos"><FileText aria-hidden="true" />Artigos</NavLink>
        <NavLink to="/admin/artigos/novo"><Plus aria-hidden="true" />Novo artigo</NavLink>
        {user.role === 'admin' && <NavLink to="/admin/certificados"><Award aria-hidden="true" />Certificados</NavLink>}
        {user.role === 'admin' && <NavLink to="/admin/configuracoes"><Settings aria-hidden="true" />Configurações</NavLink>}
      </nav>
      <div className="cms-sidebar__user"><strong>{user.display_name}</strong><span>{user.role === 'admin' ? 'Administrador' : 'Editor'}</span><button type="button" onClick={() => void logout().then(() => navigate('/admin/login'))}><LogOut aria-hidden="true" />Sair</button></div>
    </aside>
    <main className="cms-main">{children}</main>
  </div>
}
