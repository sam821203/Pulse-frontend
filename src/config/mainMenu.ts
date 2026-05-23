export interface MainMenuItemConfig {
  label: string
  icon?: string
  to?: string
  url?: string
  target?: string
  badge?: string
  visible?: boolean
  disabled?: boolean
  class?: string
  command?: (payload: { originalEvent: Event; item: MainMenuItemConfig }) => void
  items?: MainMenuItemConfig[]
}

export const mainMenuModel: MainMenuItemConfig[] = [
  {
    label: '首頁',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: '個股資訊',
    items: [
      { label: '上市公司', icon: 'pi pi-fw pi-building', to: '/listedCompany' },
      { label: '上櫃公司', icon: 'pi pi-fw pi-building', to: '/overTheCounter' }
    ]
  },
  {
    label: '帳戶',
    items: [
      { label: '個人檔案', icon: 'pi pi-fw pi-id-card', to: '/user-profile' },
      { label: '登入', icon: 'pi pi-fw pi-sign-in', to: '/login' }
    ]
  },
  {
    label: '資源',
    items: [
      {
        label: 'PrimeVue 文件',
        icon: 'pi pi-fw pi-book',
        url: 'https://primevue.org/',
        target: '_blank'
      },
      {
        label: 'PrimeFlex',
        icon: 'pi pi-fw pi-desktop',
        url: 'https://primeflex.org/',
        target: '_blank'
      }
    ]
  }
]
