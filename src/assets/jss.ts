import jss, { Classes, Styles } from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

export function createUseStyles(styles: Partial<Styles<string | number | symbol, any, undefined>>): Classes<string> {
  const sheet = jss.createStyleSheet(styles)

  const { classes } = sheet.attach()

  return classes
}
