import { expect, test } from '@playwright/test'

const articlePath = '/blog/ml-weight-initialization'
const drawerName = 'ReLU 对 E[z²] 的影响'
const triggerName = /ReLU 对 E/

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('axi-blog-graphics-warning-shown', 'true')
  })
  await page.goto(articlePath)
})

test('opens as an opaque, scrollable mobile drawer', async ({ page }) => {
  const trigger = page.getByRole('button', { name: triggerName })
  const triggerBounds = await trigger.boundingBox()

  expect(triggerBounds?.width).toBeGreaterThanOrEqual(44)
  expect(triggerBounds?.height).toBeGreaterThanOrEqual(44)

  await trigger.tap()

  const drawer = page.getByRole('dialog', { name: drawerName })
  await expect(drawer).toBeVisible()
  await expect(drawer).toHaveCSS('width', '390px')
  const backgrounds = await page.evaluate(() => ({
    body: getComputedStyle(document.body).backgroundColor,
    drawer: getComputedStyle(document.querySelector('.info-drawer-dialog')!).backgroundColor
  }))
  expect(backgrounds.drawer).toBe(backgrounds.body)
  expect(backgrounds.drawer).not.toMatch(/rgba\([^)]*,\s*0\)/)
  await expect(drawer.locator('.info-drawer-resizer')).toBeHidden()

  const content = drawer.locator('.info-drawer-content')
  const scrollState = await content.evaluate((element) => ({
    clientWidth: element.clientWidth,
    overflowY: getComputedStyle(element).overflowY,
    scrollWidth: element.scrollWidth
  }))
  expect(scrollState.scrollWidth).toBeGreaterThanOrEqual(scrollState.clientWidth)
  expect(scrollState.overflowY).toBe('auto')

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(trigger).toBeFocused()
})

test.describe('narrow responsive viewport', () => {
  test.use({
    viewport: { width: 320, height: 568 },
    hasTouch: false,
    isMobile: false
  })

  test('keeps controls and content inside the viewport', async ({ page }) => {
    expect(await page.evaluate(() => window.innerWidth)).toBe(320)
    await page.getByRole('button', { name: triggerName }).click()

    const drawer = page.getByRole('dialog', { name: drawerName })
    await drawer.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished))
    })
    const layout = await drawer.evaluate((element) => {
      const heading = element.querySelector('h2')!.getBoundingClientRect()
      const close = element.querySelector('.info-drawer-close')!.getBoundingClientRect()
      const content = element.querySelector('.info-drawer-content')!.getBoundingClientRect()
      const viewport = window.visualViewport
      return {
        closeRight: close.right,
        contentRight: content.right,
        headingRight: heading.right,
        closeLeft: close.left,
        visibleRight: viewport ? viewport.offsetLeft + viewport.width : window.innerWidth
      }
    })

    expect(layout.headingRight).toBeLessThanOrEqual(layout.closeLeft)
    expect(layout.closeRight).toBeLessThanOrEqual(layout.visibleRight)
    expect(layout.contentRight).toBeLessThanOrEqual(layout.visibleRight)
  })
})

test('closes when the header is swiped to the right', async ({ page }) => {
  await page.getByRole('button', { name: triggerName }).tap()

  const drawer = page.getByRole('dialog', { name: drawerName })
  await drawer.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished))
  })
  const header = drawer.locator('.info-drawer-header')
  const bounds = await header.boundingBox()
  expect(bounds).not.toBeNull()

  const startX = bounds!.x + 80
  const y = bounds!.y + bounds!.height / 2
  const session = await page.context().newCDPSession(page)

  const swipe = async (distance: number) => {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y }]
    })
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX + distance, y }]
    })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }

  await swipe(40)
  await expect(drawer).toBeVisible()

  await swipe(220)

  await expect(drawer).toBeHidden()
  await expect(page).toHaveURL(new RegExp(`${articlePath}$`))
  await expect(page.getByRole('button', { name: triggerName })).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})
