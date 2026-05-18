'use client'

import { useState, useEffect } from 'react'
import { Button } from '@shared/ui/button'
import { Switch } from '@shared/ui/switch'
import { Label } from '@shared/ui/label'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

type Prefs = { analytics: boolean; preferences: boolean }

const DEFAULT_PREFS: Prefs = { analytics: true, preferences: true }

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setShow(true)
  }, [])

  function save(p: Prefs) {
    localStorage.setItem('cookie-consent', JSON.stringify({ essential: true, ...p }))
    setShow(false)
    setShowSettings(false)
  }

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-card p-4 shadow-lg"
      >
        {!showSettings ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Kami menggunakan cookie untuk meningkatkan pengalaman Anda.{' '}
              <Link href="/privacy#cookies" className="text-primary underline underline-offset-2">
                Pelajari lebih lanjut
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => save({ analytics: false, preferences: false })}>
                Nanti saja
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                Atur
              </Button>
              <Button size="sm" onClick={() => save(DEFAULT_PREFS)}>
                Terima semua
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold">Pengaturan Cookie</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Cookie Esensial</Label>
                  <p className="text-xs text-muted-foreground">Diperlukan agar website berfungsi</p>
                </div>
                <Switch checked disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics" className="font-medium">Cookie Analitik</Label>
                  <p className="text-xs text-muted-foreground">Membantu kami memahami penggunaan website</p>
                </div>
                <Switch
                  id="analytics"
                  checked={prefs.analytics}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="preferences" className="font-medium">Cookie Preferensi</Label>
                  <p className="text-xs text-muted-foreground">Menyimpan preferensi bahasa dan tema</p>
                </div>
                <Switch
                  id="preferences"
                  checked={prefs.preferences}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, preferences: v }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>
                Kembali
              </Button>
              <Button size="sm" onClick={() => save(prefs)}>
                Simpan preferensi
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
