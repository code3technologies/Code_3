import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const NetworkEstimator: Block = {
  slug: 'networkEstimator',
  interfaceName: 'NetworkEstimatorBlock',
  labels: {
    singular: 'Network Estimator',
    plural: 'Network Estimators',
  },
  fields: [
    { name: 'badge', type: 'text', label: 'Badge Text', defaultValue: 'NETWORK ESTIMATOR', localized: true },
    { name: 'title', type: 'text', label: 'Title', required: true, defaultValue: 'Plan Your Network', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },

    { name: 'usersLabel', type: 'text', label: 'Users Question', defaultValue: 'How many people will use the network?', localized: true },
    optionsField('usersOptions'),
    { name: 'officesLabel', type: 'text', label: 'Offices Question', defaultValue: 'How many office locations?', localized: true },
    optionsField('officesOptions'),
    { name: 'floorsLabel', type: 'text', label: 'Floors Question', defaultValue: 'How many floors at the main site?', localized: true },
    optionsField('floorsOptions'),
    { name: 'devicesLabel', type: 'text', label: 'Devices Question', defaultValue: 'Roughly how many connected devices?', localized: true },
    optionsField('devicesOptions'),
    { name: 'internetLabel', type: 'text', label: 'Internet Connections Question', defaultValue: 'How many internet connections per site?', localized: true },
    optionsField('internetOptions'),
    { name: 'wifiLabel', type: 'text', label: 'Wi-Fi Question', defaultValue: 'Do you need business Wi-Fi?', localized: true },
    optionsField('wifiOptions'),
    { name: 'existingLabel', type: 'text', label: 'Existing Network Question', defaultValue: 'Is there a network already in place?', localized: true },
    optionsField('existingOptions'),
    { name: 'serverLabel', type: 'text', label: 'Server / Data Center Question', defaultValue: 'On-site servers or a data centre?', localized: true },
    optionsField('serverOptions'),
    { name: 'vpnLabel', type: 'text', label: 'VPN Question', defaultValue: 'Do you need VPN or secure remote access?', localized: true },
    optionsField('vpnOptions'),
    { name: 'securityLabel', type: 'text', label: 'Security Requirements Question', defaultValue: 'How strict are your security requirements?', localized: true },
    optionsField('securityOptions'),

    { name: 'submitLabel', type: 'text', label: 'Submit Button Label', defaultValue: 'Get My Network Recommendation', localized: true },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
