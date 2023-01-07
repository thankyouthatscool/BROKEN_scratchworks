# Output
output "private_key" {
  value     = tls_private_key.scratchworks_private_key.private_key_pem
  sensitive = true
}

output "public_dns" {
  value = aws_instance.scratchworks_instance.public_dns
}

output "public_ip" {
  value = aws_instance.scratchworks_instance.public_ip
}
